import { ACTIONS } from '@pollyjs/utils';

export default function adapterTests() {
  it('should respect request order', async function() {
    let res = await this.fetchRecord();

    expect(res.status).to.equal(404);

    res = await this.fetchRecord({
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
      headers: { 'Content-Type': 'application/json' }
    });

    expect(res.status).to.equal(200);

    res = await this.fetchRecord();
    const json = await res.json();

    expect(json).to.deep.equal({ foo: 'bar' });

    res = await this.fetchRecord({ method: 'DELETE' });
    expect(res.status).to.equal(200);

    res = await this.fetchRecord();
    expect(res.status).to.equal(404);
  });

  it('should properly handle 204 status code response', async function() {
    const res = await this.relativeFetch('/echo?status=204');

    expect(res.status).to.equal(204);
    expect((await res.text())).to.equal('');
  });

  it('should intercept', async function() {
    const { server } = this.polly;

    server
      .any(this.recordUrl())
      .intercept((_, res) => res.status(201));

    server
      .get(this.recordUrl())
      .intercept((req, res) => res.json(req.query));

    const res = await this.fetch(`${this.recordUrl()}?foo=bar`);
    const json = await res.json();

    expect(res.status).to.equal(201);
    expect(json).to.deep.equal({ foo: 'bar' });
  });

  it('should passthrough', async function() {
    const { server, persister, recordingId } = this.polly;

    server.get(this.recordUrl()).passthrough();

    expect(await persister.find(recordingId)).to.be.null;
    expect((await this.fetchRecord()).status).to.equal(404);
    expect(await persister.find(recordingId)).to.be.null;
  });

  it('should be able to intercept when in passthrough mode', async function() {
    const { server } = this.polly;

    this.polly.configure({ mode: 'passthrough' });

    server
      .get(this.recordUrl())
      .intercept((req, res) => res.status(200).send('Hello'));

    const res = await this.fetchRecord();
    const text = await res.text();

    expect(res.status).to.equal(200);
    expect(text).to.equal('Hello');
  });

  it('should be able to abort from an intercept', async function() {
    const { server } = this.polly;
    let responseCalled = false;

    server
      .get(this.recordUrl())
      .intercept((req, res, interceptor) => interceptor.abort())
      .on('response', req => {
        responseCalled = true;
        expect(req.action).to.not.equal(ACTIONS.INTERCEPT);
      });

    expect((await this.fetchRecord()).status).to.equal(404);
    expect(responseCalled).to.be.true;
  });

  it('should be able to passthrough from an intercept', async function() {
    const { server, persister, recordingId } = this.polly;
    let responseCalled = false;

    server
      .get(this.recordUrl())
      .intercept((req, res, interceptor) => interceptor.passthrough())
      .on('response', req => {
        responseCalled = true;
        expect(req.action).to.equal(ACTIONS.PASSTHROUGH);
      });

    expect(await persister.find(recordingId)).to.be.null;
    expect((await this.fetchRecord()).status).to.equal(404);
    expect(await persister.find(recordingId)).to.be.null;
    expect(responseCalled).to.be.true;
  });

  it('should have resolved requests after flushing', async function() {
    // The puppeteer adapter has its own implementation of this test
    if (this.polly.adapters.has('puppeteer')) {
      this.skip();
    }

    const { server } = this.polly;
    const requests = [];
    const resolved = [];

    server
      .get(this.recordUrl())
      .intercept(async (req, res) => {
        await server.timeout(5);
        res.sendStatus(200);
      })
      .on('request', req => requests.push(req));

    this.fetchRecord().then(() => resolved.push(1));
    this.fetchRecord().then(() => resolved.push(2));
    this.fetchRecord().then(() => resolved.push(3));

    await this.polly.flush();

    expect(requests).to.have.lengthOf(3);
    requests.forEach(request => expect(request.didRespond).to.be.true);
    expect(resolved).to.have.members([1, 2, 3]);
  });

  it('should work with CORS requests', async function() {
    const { server } = this.polly;
    const apiUrl = 'https://jsonplaceholder.typicode.com';

    server.any(`${apiUrl}/*`).passthrough();

    let res = await this.fetch(`${apiUrl}/posts/1`);

    expect(res.ok).to.be.true;
    expect(await res.json()).to.be.an('object');

    res = await this.fetch(`${apiUrl}/posts`, {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' })
    });

    expect(res.ok).to.be.true;
  });
}
