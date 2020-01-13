import { Polly } from '@pollyjs/core';
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
    expect(await res.text()).to.equal('');
  });

  it('should intercept', async function() {
    const { server } = this.polly;

    server.any(this.recordUrl()).intercept((_, res) => res.status(201));

    server.get(this.recordUrl()).intercept((req, res) => res.json(req.query));

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

  it('should call all the life-cycle events', async function() {
    const { server } = this.polly;
    const events = [];

    server
      .get(this.recordUrl())
      .on('request', () => events.push('request'))
      .on('beforeResponse', () => events.push('beforeResponse'))
      .on('response', () => events.push('response'));

    await this.fetchRecord();

    expect(events).to.have.ordered.members([
      'request',
      'beforeResponse',
      'response'
    ]);
  });

  it('should call beforeReplay with a cloned recording entry', async function() {
    const { recordingId, recordingName, config } = this.polly;
    let replayedEntry;

    this.polly.record();
    await this.fetchRecord();
    await this.polly.stop();

    this.polly = new Polly(recordingName, config);
    this.polly.replay();

    const har = await this.polly.persister.find(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(1);

    this.polly.server
      .get(this.recordUrl())
      .on('beforeReplay', (_req, entry) => (replayedEntry = entry));

    const entry = har.log.entries[0];

    await this.fetchRecord();

    expect(replayedEntry).to.be.an('object');

    expect(entry).to.deep.equal(replayedEntry);
    expect(entry).to.not.equal(replayedEntry);

    expect(entry.request).to.deep.equal(replayedEntry.request);
    expect(entry.request).to.not.equal(replayedEntry.request);

    expect(entry.response).to.deep.equal(replayedEntry.response);
    expect(entry.response).to.not.equal(replayedEntry.response);

    expect(entry.response.content).to.deep.equal(
      replayedEntry.response.content
    );
    expect(entry.response.content).to.not.equal(replayedEntry.response.content);
  });

  it('should emit an error event', async function() {
    const { server } = this.polly;
    let error;

    this.polly.configure({ recordIfMissing: false });

    server.get(this.recordUrl()).on('error', (req, err) => (error = err));

    try {
      await this.fetchRecord();
    } catch (e) {
      /* noop */
    }

    expect(error).to.exist;
    expect(error.message).to.match(
      /Recording for the following request is not found/
    );
  });

  it('should handle a compressed response', async function() {
    const res = await this.relativeFetch('/compress', {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
      headers: { 'Content-Type': 'application/json' }
    });

    expect(res.status).to.equal(200);
    expect(await res.json()).to.deep.equal({ foo: 'bar' });
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
    this.timeout(10000);

    const { server } = this.polly;
    const apiUrl = 'http://jsonplaceholder.typicode.com';

    server.any(`${apiUrl}/*`).passthrough();

    let res = await this.fetch(`${apiUrl}/posts/1`);

    expect(res.ok).to.be.true;
    expect(await res.json()).to.be.an('object');

    res = await this.fetch(`${apiUrl}/posts`, {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
      headers: { 'Content-Type': 'application/json' }
    });

    expect(res.ok).to.be.true;
  });

  describe('Expiration', () => {
    async function testExpiration() {
      const { persister, recordingId } = this.polly;
      const url = '/api';
      let har;

      // request number one - records the request
      this.polly.record();
      await this.relativeFetch(url);
      await persister.persist();
      har = await persister.find(recordingId);

      expect(har).to.be.an('object');
      expect(har.log.entries).to.have.lengthOf(1);
      const prevDateTime = har.log.entries[0].startedDateTime;

      // wait for the first request to expire
      await new Promise(r => setTimeout(r, 10));

      // request number two - the first request is now expired
      this.polly.replay();
      await this.relativeFetch(url);
      await persister.persist();
      har = await persister.find(recordingId);

      expect(har).to.be.an('object');
      expect(har.log.entries).to.have.lengthOf(1);
      const nextDateTime = har.log.entries[0].startedDateTime;

      // boolean returned is true if re-record occurred
      return prevDateTime !== nextDateTime;
    }

    beforeEach(function() {
      this.polly.configure({
        expiresIn: '1ms',
        matchRequestsBy: {
          order: false
        }
      });
    });

    afterEach(async function() {
      await this.polly.persister.delete(this.polly.recordingId);
    });

    it('re-records on expired recording if recordIfExpired is true', async function() {
      this.polly.configure({ recordIfExpired: true });
      expect(await testExpiration.call(this)).to.equal(true);
    });

    it('replays the expired recording if recordIfExpired is false', async function() {
      this.polly.configure({ recordIfExpired: false });
      expect(await testExpiration.call(this)).to.equal(false);
    });

    it('warns and plays back on expired recording if expiryStrategy is "warn"', async function() {
      this.polly.configure({ expiryStrategy: 'warn' });
      expect(await testExpiration.call(this)).to.equal(false);
    });

    it('re-records on expired recording if expiryStrategy is "record"', async function() {
      this.polly.configure({ expiryStrategy: 'record' });
      expect(await testExpiration.call(this)).to.equal(true);
    });

    it('throws on expired recording if expiryStrategy is "error"', async function() {
      const { server } = this.polly;
      let error;

      this.polly.configure({ expiryStrategy: 'error' });
      server.any().on('error', (req, e) => (error = e));

      try {
        await testExpiration.call(this);
      } catch (e) {
        // noop
      }

      expect(error).to.exist;
      expect(error.message).to.match(
        /Recording for the following request has expired/
      );
    });
  });
}
