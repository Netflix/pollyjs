import { Polly } from '@pollyjs/core';
import * as validate from 'har-validator/lib/async';

export default function persisterTests() {
  it('should persist valid HAR', async function () {
    const { recordingId, persister } = this.polly;

    this.polly.record();
    await this.fetchRecord();
    await persister.persist();

    expect(await validate.har(await persister.findRecording(recordingId))).to.be
      .true;

    await this.fetchRecord({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'bar', bar: 'baz' })
    });

    await persister.persist();

    expect(await validate.har(await persister.findRecording(recordingId))).to.be
      .true;
  });

  it('should have the correct metadata', async function () {
    const { recordingId, recordingName, persister } = this.polly;

    this.polly.record();
    await this.fetchRecord();
    await persister.persist();

    const har = await persister.findRecording(recordingId);
    const { _recordingName, creator, entries } = har.log;
    const entry = entries[0];

    expect(_recordingName).to.equal(recordingName);

    expect(creator.name).to.equal('Polly.JS');
    expect(creator.version).to.equal(Polly.VERSION);
    expect(creator.comment).to.equal(
      `${persister.constructor.type}:${persister.constructor.id}`
    );

    expect(entry).to.be.an('object');
    expect(entry._id).to.a('string');
    expect(entry._order).to.equal(0);
  });

  it('should add new entries to an existing recording', async function () {
    const { recordingId, recordingName, config } = this.polly;
    let { persister } = this.polly;

    const orderedRecordUrl = (order) => `${this.recordUrl()}?order=${order}`;

    this.polly.record();
    await this.fetch(orderedRecordUrl(1));
    await persister.persist();

    let har = await persister.findRecording(recordingId);

    expect(har.log.entries).to.have.lengthOf(1);

    await this.polly.stop();

    this.polly = new Polly(recordingName, config);
    persister = this.polly.persister;

    this.polly.record();
    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(2));
    await persister.persist();

    har = await persister.findRecording(recordingId);

    expect(har.log.entries).to.have.lengthOf(3);
    expect(
      har.log.entries.filter((e) => e.request.url.includes(orderedRecordUrl(1)))
    ).to.have.lengthOf(2);
    expect(
      har.log.entries.filter((e) => e.request.url.includes(orderedRecordUrl(2)))
    ).to.have.lengthOf(1);
  });

  it('should emit beforePersist', async function () {
    const { persister, server } = this.polly;
    let beforePersistCalled = false;

    server.get(this.recordUrl()).on('beforePersist', (req /*, res*/) => {
      expect(beforePersistCalled).to.be.false;
      expect(() => (req.body = 'test')).to.throw(Error);
      beforePersistCalled = true;
    });

    this.polly.record();

    await this.fetchRecord();
    expect(beforePersistCalled).to.be.false;

    await persister.persist();
    expect(beforePersistCalled).to.be.true;
  });

  it('should respect recording name overrides', async function () {
    const { server, persister } = this.polly;
    const recordingName = 'Default Override';
    let recordingId;

    server
      .get(this.recordUrl())
      .recordingName(recordingName)
      .on('request', (req) => {
        expect(req.recordingName).to.equal(recordingName);
        recordingId = req.recordingId;
      });

    this.polly.record();
    await this.fetchRecord();
    await persister.persist();

    expect(recordingId).to.include('Override');

    const har = await persister.findRecording(recordingId);

    expect(await validate.har(har)).to.be.true;
    expect(har.log.entries).to.have.lengthOf(1);

    // Set the new recording name so the afterEach hook deletes the recording
    this.polly.recordingName = recordingName;
  });

  it('should correctly handle array header values', async function () {
    const { recordingId, server, persister } = this.polly;
    let responseCalled = false;

    this.polly.record();

    server
      .get(this.recordUrl())
      .configure({ matchRequestsBy: { order: false } })
      .once('beforeResponse', (req, res) => {
        res.setHeaders({
          string: 'foo',
          one: ['foo'],
          two: ['foo', 'bar']
        });
      });

    await this.fetchRecord();
    await persister.persist();

    const har = await persister.findRecording(recordingId);
    const { headers } = har.log.entries[0].response;

    expect(await validate.har(har)).to.be.true;
    expect(
      headers.filter(({ _fromType }) => _fromType === 'array')
    ).to.have.lengthOf(3);

    this.polly.replay();

    server.get(this.recordUrl()).once('response', (req, res) => {
      expect(res.getHeader('string')).to.equal('foo');
      expect(res.getHeader('one')).to.deep.equal(['foo']);
      expect(res.getHeader('two')).to.deep.equal(['foo', 'bar']);
      responseCalled = true;
    });

    await this.fetchRecord();
    expect(responseCalled).to.be.true;
  });

  it('should correctly handle array header values where a single header is expected', async function () {
    const { recordingId, server, persister } = this.polly;

    this.polly.record();

    server.get(this.recordUrl()).once('beforeResponse', (req, res) => {
      res.setHeaders({
        Location: ['./index.html'],
        'Content-Type': ['application/json']
      });
    });

    await this.fetchRecord();
    await persister.persist();

    const har = await persister.findRecording(recordingId);
    const { content, redirectURL } = har.log.entries[0].response;

    expect(await validate.har(har)).to.be.true;
    expect(content.mimeType).to.equal('application/json');
    expect(redirectURL).to.equal('./index.html');
  });

  it('should error when persisting a failed request', async function () {
    let error;

    this.polly.configure({ recordFailedRequests: false });

    try {
      await this.fetchRecord();
      await this.polly.stop();
    } catch (e) {
      error = e;
    } finally {
      const savedRecording = await this.polly.persister.findRecording(
        this.polly.recordingId
      );

      expect(savedRecording).to.be.null;
      expect(error.message).to.contain('Cannot persist response for');

      // Clear the pending requests so `this.polly.stop()` in the
      // afterEach hook won't bomb.
      this.polly.persister.pending.clear();
    }
  });

  it('should not error when persisting a failed request and `recordFailedRequests` is true', async function () {
    this.polly.configure({ recordFailedRequests: true });

    await this.fetchRecord();
    await this.polly.stop();

    const har = await this.polly.persister.findRecording(
      this.polly.recordingId
    );

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(1);
  });

  it('should remove unused entries when `keepUnusedRequests` is false', async function () {
    const { recordingName, recordingId, config } = this.polly;

    const orderedRecordUrl = (order) => `${this.recordUrl()}?order=${order}`;

    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(2));
    await this.polly.persister.persist();

    let har = await this.polly.persister.findRecording(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(2);

    await this.polly.stop();

    this.polly = new Polly(recordingName, config);
    this.polly.replay();
    this.polly.configure({
      persisterOptions: {
        keepUnusedRequests: false
      }
    });

    await this.fetch(orderedRecordUrl(1)); // -> Replay
    await this.fetch(orderedRecordUrl(3)); // -> New recording
    await this.polly.persister.persist();

    har = await this.polly.persister.findRecording(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(2);
    expect(har.log.entries[0].request.url).to.include(orderedRecordUrl(1));
    expect(har.log.entries[1].request.url).to.include(orderedRecordUrl(3));
  });

  it('should sort the entries by date', async function () {
    this.polly.configure({
      persisterOptions: {
        keepUnusedRequests: true
      }
    });
    const { recordingName, recordingId, config } = this.polly;

    const orderedRecordUrl = (order) => `${this.recordUrl()}?order=${order}`;

    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(2));
    await this.polly.persister.persist();

    let har = await this.polly.persister.findRecording(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(2);
    expect(har.log.entries[0].request.url).to.include(orderedRecordUrl(1));
    expect(har.log.entries[1].request.url).to.include(orderedRecordUrl(2));

    await this.polly.stop();

    this.polly = new Polly(recordingName, config);
    this.polly.record();

    await this.fetch(orderedRecordUrl(3));
    await this.fetch(orderedRecordUrl(4));
    await this.fetch(orderedRecordUrl(2));
    await this.polly.persister.persist();

    har = await this.polly.persister.findRecording(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(4);
    expect(har.log.entries[0].request.url).to.include(orderedRecordUrl(1));
    expect(har.log.entries[1].request.url).to.include(orderedRecordUrl(3));
    expect(har.log.entries[2].request.url).to.include(orderedRecordUrl(4));
    expect(har.log.entries[3].request.url).to.include(orderedRecordUrl(2));
  });

  it('should not sort the entries by date if `disableSortingHarEntries` is true', async function () {
    this.polly.configure({
      persisterOptions: {
        keepUnusedRequests: true,
        disableSortingHarEntries: true
      }
    });
    const { recordingName, recordingId, config } = this.polly;

    const orderedRecordUrl = (order) => `${this.recordUrl()}?order=${order}`;

    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(2));
    await this.polly.persister.persist();

    let har = await this.polly.persister.findRecording(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(2);
    expect(har.log.entries[0].request.url).to.include(orderedRecordUrl(1));
    expect(har.log.entries[1].request.url).to.include(orderedRecordUrl(2));

    await this.polly.stop();

    this.polly = new Polly(recordingName, config);
    this.polly.replay();

    await this.fetch(orderedRecordUrl(3));
    await this.fetch(orderedRecordUrl(4));
    await this.polly.persister.persist();

    har = await this.polly.persister.findRecording(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(4);
    expect(har.log.entries[0].request.url).to.include(orderedRecordUrl(3));
    expect(har.log.entries[1].request.url).to.include(orderedRecordUrl(4));
    expect(har.log.entries[2].request.url).to.include(orderedRecordUrl(1));
    expect(har.log.entries[3].request.url).to.include(orderedRecordUrl(2));
  });

  it('should correctly handle binary responses', async function () {
    const { recordingId, server, persister } = this.polly;
    let har, content;

    this.polly.record();

    // Non binary content
    server.get(this.recordUrl()).once('beforeResponse', (req, res) => {
      res.body = 'Some content';
    });

    await this.fetchRecord();
    await persister.persist();

    har = await persister.findRecording(recordingId);
    content = har.log.entries[0].response.content;

    expect(await validate.har(har)).to.be.true;
    expect(content.encoding).to.be.undefined;

    // Binary content
    server.get(this.recordUrl()).once('beforeResponse', (req, res) => {
      res.encoding = 'base64';
      res.body = 'U29tZSBjb250ZW50';
    });

    await this.fetchRecord();
    await persister.persist();

    har = await persister.findRecording(recordingId);
    content = har.log.entries[1].response.content;

    expect(await validate.har(har)).to.be.true;
    expect(content.encoding).to.equal('base64');

    // Binary content with no body
    server.get(this.recordUrl()).once('beforeResponse', (req, res) => {
      res.encoding = 'base64';
      res.body = '';
    });

    await this.fetchRecord();
    await persister.persist();

    har = await persister.findRecording(recordingId);
    content = har.log.entries[2].response.content;

    expect(await validate.har(har)).to.be.true;
    expect(content.encoding).to.be.undefined;
  });
}
