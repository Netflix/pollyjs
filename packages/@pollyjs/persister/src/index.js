import HAR from './har';
import Entry from './har/entry';
import stringify from 'fast-json-stable-stringify';
import { assert } from '@pollyjs/utils';

const CREATOR_NAME = 'Polly.JS';

export default class Persister {
  constructor(polly) {
    this.polly = polly;
    this.cache = new Map();
    this.pending = new Map();
  }

  get hasPending() {
    /*
      Although the pending map is bucketed by recordingId, the bucket will always
      be created with a single item in it so we can assume that if a bucket
      exists, then it has items in it.
    */
    return this.pending.size > 0;
  }

  get config() {
    return this.polly.config.persisterOptions;
  }

  async persist() {
    if (!this.hasPending) {
      return;
    }

    const promises = [];

    for (const [recordingId, { name, requests }] of this.pending) {
      const entries = [];
      const recording = await this.find(recordingId);
      let har;

      if (!recording) {
        har = new HAR({
          log: {
            creator: {
              name: CREATOR_NAME,
              version: this.polly.VERSION
            },
            _recordingName: name
          }
        });
      } else {
        har = new HAR(recording);
      }

      for (const request of requests) {
        const entry = new Entry(request);

        assert(
          `Cannot persist response for [${entry.request.method}] ${
            entry.request.url
          } because the status code was ${
            entry.response.status
          } and \`recordFailedRequests\` is \`false\``,
          request.response.ok || this.polly.config.recordFailedRequests
        );

        /*
          Trigger the `beforePersist` event on each new recorded entry.

          NOTE: This must be triggered last as this entry can be used to
                modify the payload (i.e. encrypting the request & response).
        */
        await request._emit('beforePersist', entry);

        entries.push(entry);
      }

      har.log.addEntries(entries);
      promises.push(this.save(recordingId, har));
    }

    await Promise.all(promises);
    this.pending.clear();
  }

  recordRequest(pollyRequest) {
    assert(`You must pass a PollyRequest to 'recordRequest'.`, pollyRequest);
    assert(`Cannot save a request with no response.`, pollyRequest.didRespond);

    const { recordingId, recordingName } = pollyRequest;

    if (!this.pending.has(recordingId)) {
      this.pending.set(recordingId, { name: recordingName, requests: [] });
    }

    this.pending.get(recordingId).requests.push(pollyRequest);
  }

  async find(recordingId) {
    if (this.cache.has(recordingId)) {
      return this.cache.get(recordingId);
    }

    const recording = await this.findRecording(recordingId);

    if (recording) {
      assert(
        `Recording with id '${recordingId}' is invalid. Please delete the recording so a new one can be created.`,
        recording.log && recording.log.creator.name === CREATOR_NAME
      );
      this.cache.set(recordingId, recording);
    }

    return recording;
  }

  async save(recordingId) {
    await this.saveRecording(...arguments);
    this.cache.delete(recordingId);
  }

  async delete(recordingId) {
    await this.deleteRecording(...arguments);
    this.cache.delete(recordingId);
  }

  async findEntry(pollyRequest) {
    const { id, order, recordingId } = pollyRequest;
    const recording = await this.find(recordingId);

    return (
      (recording &&
        recording.log.entries.find(
          entry => entry._id === id && entry._order === order
        )) ||
      null
    );
  }

  stringify() {
    return stringify(...arguments);
  }

  findRecording() {
    assert('[Persister] Must implement the `findRecording` hook.', false);
  }

  saveRecording() {
    assert('[Persister] Must implement the `saveRecording` hook.', false);
  }

  deleteRecording() {
    assert('[Persister] Must implement the `deleteRecording` hook.', false);
  }
}
