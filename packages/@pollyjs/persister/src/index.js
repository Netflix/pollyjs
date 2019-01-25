import stringify from 'fast-json-stable-stringify';
import { ACTIONS, assert } from '@pollyjs/utils';

import HAR from './har';
import Entry from './har/entry';

const CREATOR_NAME = 'Polly.JS';

export default class Persister {
  constructor(polly) {
    this.polly = polly;
    this.pending = new Map();
    this._cache = new Map();
  }

  static get type() {
    return 'persister';
  }

  /* eslint-disable-next-line getter-return */
  static get name() {
    assert('Must override the static `name` getter.');
  }

  get defaultOptions() {
    return {};
  }

  get options() {
    const { name } = this.constructor;

    return {
      ...(this.defaultOptions || {}),
      ...((this.polly.config.persisterOptions || {})[name] || {})
    };
  }

  get hasPending() {
    /*
      Although the pending map is bucketed by recordingId, the bucket will always
      be created with a single item in it so we can assume that if a bucket
      exists, then it has items in it.
    */
    return this.pending.size > 0;
  }

  async persist() {
    if (!this.hasPending) {
      return;
    }

    const promises = [];
    const creator = {
      name: CREATOR_NAME,
      version: this.polly.constructor.VERSION,
      comment: `${this.constructor.type}:${this.constructor.name}`
    };

    for (const [recordingId, { name, requests }] of this.pending) {
      const entries = [];
      const recording = await this.find(recordingId);
      let har;

      if (!recording) {
        har = new HAR({ log: { creator, _recordingName: name } });
      } else {
        har = new HAR(recording);
      }

      for (const request of requests) {
        const entry = new Entry(request);

        this.assert(
          `Cannot persist response for [${entry.request.method}] ${
            entry.request.url
          } because the status code was ${
            entry.response.status
          } and \`recordFailedRequests\` is \`false\``,
          request.response.ok || request.config.recordFailedRequests
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

      if (!this.polly.config.persisterOptions.keepUnusedRequests) {
        this._removeUnusedEntries(recordingId, har);
      }

      promises.push(this.save(recordingId, har));
    }

    await Promise.all(promises);
    this.pending.clear();
  }

  recordRequest(pollyRequest) {
    this.assert(
      `You must pass a PollyRequest to 'recordRequest'.`,
      pollyRequest
    );
    this.assert(
      `Cannot save a request with no response.`,
      pollyRequest.didRespond
    );

    const { recordingId, recordingName } = pollyRequest;

    if (!this.pending.has(recordingId)) {
      this.pending.set(recordingId, { name: recordingName, requests: [] });
    }

    this.pending.get(recordingId).requests.push(pollyRequest);
  }

  async find(recordingId) {
    const { _cache: cache } = this;

    if (!cache.has(recordingId)) {
      const findRecording = async () => {
        const recording = await this.findRecording(recordingId);

        if (recording) {
          this.assert(
            `Recording with id '${recordingId}' is invalid. Please delete the recording so a new one can be created.`,
            recording.log && recording.log.creator.name === CREATOR_NAME
          );

          return recording;
        } else {
          cache.delete(recordingId);

          return null;
        }
      };

      cache.set(recordingId, findRecording());
    }

    return cache.get(recordingId);
  }

  async save(recordingId) {
    await this.saveRecording(...arguments);
    this._cache.delete(recordingId);
  }

  async delete(recordingId) {
    await this.deleteRecording(...arguments);
    this._cache.delete(recordingId);
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

  assert(message, ...args) {
    assert(
      `[${this.constructor.type}:${this.constructor.name}] ${message}`,
      ...args
    );
  }

  /**
   * Remove all entries from the given HAR that do not match any requests in
   * the current Polly instance.
   *
   * @param {String} recordingId
   * @param {HAR} har
   */
  _removeUnusedEntries(recordingId, har) {
    const requests = this.polly._requests.filter(
      r =>
        r.recordingId === recordingId &&
        (r.action === ACTIONS.RECORD || r.action === ACTIONS.REPLAY)
    );

    har.log.entries = har.log.entries.filter(entry =>
      requests.find(r => entry._id === r.id && entry._order === r.order)
    );
  }

  findRecording() {
    this.assert('Must implement the `findRecording` hook.');
  }

  saveRecording() {
    this.assert('Must implement the `saveRecording` hook.');
  }

  deleteRecording() {
    this.assert('Must implement the `deleteRecording` hook.');
  }
}
