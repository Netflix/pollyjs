import { Polly } from '@pollyjs/core';
import * as validate from 'har-validator/lib/async';

export default function persisterTests() {
  it('should persist valid HAR', async function() {
    const { recordingId, persister } = this.polly;

    this.polly.record();
    await this.fetchRecord();
    await persister.persist();

    expect(await validate.har(await persister.find(recordingId))).to.be.true;

    await this.fetchRecord({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'bar', bar: 'baz' })
    });

    await persister.persist();

    expect(await validate.har(await persister.find(recordingId))).to.be.true;
  });

  it('should have the correct metadata', async function() {
    const { recordingId, recordingName, persister } = this.polly;

    this.polly.record();
    await this.fetchRecord();
    await persister.persist();

    const har = await persister.find(recordingId);
    const { _recordingName, creator, entries } = har.log;
    const entry = entries[0];

    expect(_recordingName).to.equal(recordingName);

    expect(creator.name).to.equal('Polly.JS');
    expect(creator.version).to.equal(Polly.VERSION);
    expect(creator.comment).to.equal(
      `${persister.constructor.type}:${persister.constructor.name}`
    );

    expect(entry).to.be.an('object');
    expect(entry._id).to.a('string');
    expect(entry._order).to.equal(0);
  });

  it('should add new entries to an existing recording', async function() {
    const { recordingId, recordingName, config } = this.polly;
    let { persister } = this.polly;

    const orderedRecordUrl = order => `${this.recordUrl()}?order=${order}`;

    this.polly.record();
    await this.fetch(orderedRecordUrl(1));
    await persister.persist();

    let har = await persister.find(recordingId);

    expect(har.log.entries).to.have.lengthOf(1);

    await this.polly.stop();

    this.polly = new Polly(recordingName, config);
    persister = this.polly.persister;

    this.polly.record();
    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(2));
    await persister.persist();

    har = await persister.find(recordingId);

    expect(har.log.entries).to.have.lengthOf(3);
    expect(
      har.log.entries.filter(e => e.request.url.includes(orderedRecordUrl(1)))
    ).to.have.lengthOf(2);
    expect(
      har.log.entries.filter(e => e.request.url.includes(orderedRecordUrl(2)))
    ).to.have.lengthOf(1);
  });

  it('should emit beforePersist', async function() {
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

  it('should respect recording name overrides', async function() {
    const { server, persister } = this.polly;
    const recordingName = 'Default Override';
    let recordingId;

    server
      .get(this.recordUrl())
      .recordingName(recordingName)
      .on('request', req => {
        expect(req.recordingName).to.equal(recordingName);
        recordingId = req.recordingId;
      });

    this.polly.record();
    await this.fetchRecord();
    await persister.persist();

    expect(recordingId).to.include('Override');

    const har = await persister.find(recordingId);

    expect(await validate.har(har)).to.be.true;
    expect(har.log.entries).to.have.lengthOf(1);

    // Set the new recording name so the afterEach hook deletes the recording
    this.polly.recordingName = recordingName;
  });

  it('should error when persisting a failed request', async function() {
    let error;

    this.polly.configure({ recordFailedRequests: false });

    try {
      await this.fetchRecord();
      await this.polly.stop();
    } catch (e) {
      error = e;
    } finally {
      const savedRecording = await this.polly.persister.find(
        this.polly.recordingId
      );

      expect(savedRecording).to.be.null;
      expect(error.message).to.contain('Cannot persist response for');

      // Clear the pending requests so `this.polly.stop()` in the
      // afterEach hook won't bomb.
      this.polly.persister.pending.clear();
    }
  });

  it('should not error when persisting a failed request and `recordFailedRequests` is true', async function() {
    this.polly.configure({ recordFailedRequests: true });

    await this.fetchRecord();
    await this.polly.stop();

    const har = await this.polly.persister.find(this.polly.recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(1);
  });

  it('should remove unused entries when `keepUnusedRequests` is false', async function() {
    const { recordingName, recordingId, config } = this.polly;

    const orderedRecordUrl = order => `${this.recordUrl()}?order=${order}`;

    await this.fetch(orderedRecordUrl(1));
    await this.fetch(orderedRecordUrl(2));
    await this.polly.persister.persist();

    let har = await this.polly.persister.find(recordingId);

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

    har = await this.polly.persister.find(recordingId);

    expect(har).to.be.an('object');
    expect(har.log.entries).to.have.lengthOf(2);
    expect(har.log.entries[0].request.url).to.include(orderedRecordUrl(1));
    expect(har.log.entries[1].request.url).to.include(orderedRecordUrl(3));
  });
}
