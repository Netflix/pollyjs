import { timestamp, assert } from '@pollyjs/utils';
import uniqWith from 'lodash-es/uniqWith';
import HAR from './har';

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

    const createdAt = timestamp();
    const promises = [];

    for (const [recordingId, { name, requests }] of this.pending) {
      const entries = [];
      let recording = await this.find(recordingId);

      for (const request of requests) {
        const entry = new HAR.Entry(request);

        assert(
          `Cannot persist response for [${entry.request.method}] ${
            entry.request.url
          } because the status code was ${
            entry.response.status
          } and \`recordFailedRequests\` is \`false\``,
          request.response.ok || this.polly.config.recordFailedRequests
        );

        // Add the created at timestamp to each new entry
        entry._pollyjs_meta.createdAt = createdAt;

        /*
          Trigger the `beforePersist` event on each new recorded entry.

          NOTE: This must be triggered last as this entry can be used to
                modify the payload (i.e. encrypting the request & response).
        */
        await request._trigger('beforePersist', entry);

        entries.push(entry);
      }

      if (!recording) {
        // If not, create a new one
        recording = {
          log: new HAR.Log({
            creator: {
              name: 'Polly.JS',
              version: this.polly.VERSION
            },
            _pollyjs_meta: {
              recordingName: name,
              createdAt
            }
          })
        };
      }

      recording.addEntries(entries);
      promises.push(this.save(recordingId, recording));
    }

    await Promise.all(promises);
    this.pending.clear();
  }

  createRecording(requests) {
    return {
      log: new HAR.Log({
        creator: {
          name: 'Polly.JS',
          version: this.polly.VERSION
        },
        _pollyjs_meta: {
          recordingName: name,
          createdAt
        }
      })
    };
  }

  addEntries(recording, entries = []) {
    recording.log.entries = uniqWith(
      [...entries, ...recording.log.entries],
      (a, b) => {
        a._pollyjs_meta.id !== b._pollyjs_meta.id &&
          a._pollyjs_meta.order !== b._pollyjs_meta.order;
      }
    );

    this.sortEntries();
  }

  sortEntries() {
    const { entries } = this;

    this.entries = entries.sort(
      (a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime)
    );
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

    if (!recording) {
      return null;
    }

    return (recording.entries[id] || [])[order] || null;
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
