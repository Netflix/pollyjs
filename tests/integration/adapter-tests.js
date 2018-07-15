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

  it('should intercept', async function() {
    const { server } = this.polly;

    server
      .get(this.recordUrl())
      .intercept((req, res) => res.status(200).json(req.query));

    const res = await this.fetch(`${this.recordUrl()}?foo=bar`);
    const json = await res.json();

    expect(res.status).to.equal(200);
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
}
