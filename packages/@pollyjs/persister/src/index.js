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
  static get id() {
    assert('Must override the static `id` getter.');
  }

  get defaultOptions() {
    return {};
  }

  get options() {
    return {
      ...(this.defaultOptions || {}),
      ...((this.polly.config.persisterOptions || {})[this.constructor.id] || {})
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
      comment: `${this.constructor.type}:${this.constructor.id}`
    };

    for (const [recordingId, { name, requests }] of this.pending) {
      const entries = [];
      const recording = await this.findRecording(recordingId);
      let har;

      if (!recording) {
        har = new HAR({ log: { creator, _recordingName: name } });
      } else {
        har = new HAR(recording);
      }

      for (const request of requests) {
        const entry = new Entry(request);

        this.assert(
          `Cannot persist response for [${entry.request.method}] ${entry.request.url} because the status code was ${entry.response.status} and \`recordFailedRequests\` is \`false\``,
          entry.response.status < 400 || request.config.recordFailedRequests
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

      if (!this.polly.config.persisterOptions.disableSortingHarEntries) {
        har.log.sortEntries();
      }

      if (!this.polly.config.persisterOptions.keepUnusedRequests) {
        this._removeUnusedEntries(recordingId, har);
      }

      promises.push(this.saveRecording(recordingId, har));
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

  async findRecording(recordingId) {
    const { _cache: cache } = this;

    if (!cache.has(recordingId)) {
      const onFindRecording = async () => {
        const recording = await this.onFindRecording(recordingId);

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

      cache.set(recordingId, onFindRecording());
    }

    return cache.get(recordingId);
  }

  onFindRecording() {
    this.assert('Must implement the `onFindRecording` hook.');
  }

  async saveRecording(recordingId, har) {
    await this.onSaveRecording(...arguments);
    this._cache.delete(recordingId);
    this.polly.logger.log.debug('Recording saved.', { recordingId, har });
  }

  onSaveRecording() {
    this.assert('Must implement the `onSaveRecording` hook.');
  }

  async deleteRecording(recordingId) {
    await this.onDeleteRecording(...arguments);
    this._cache.delete(recordingId);
  }

  onDeleteRecording() {
    this.assert('Must implement the `onDeleteRecording` hook.');
  }

  async findEntry(pollyRequest) {
    const { id, order, recordingId } = pollyRequest;
    const recording = await this.findRecording(recordingId);

    return (
      (recording &&
        recording.log.entries.find(
          (entry) => entry._id === id && entry._order === order
        )) ||
      null
    );
  }

  stringify() {
    return stringify(...arguments);
  }

  assert(message, ...args) {
    assert(
      `[${this.constructor.type}:${this.constructor.id}] ${message}`,
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
      (r) =>
        r.recordingId === recordingId &&
        (r.action === ACTIONS.RECORD || r.action === ACTIONS.REPLAY)
    );

    har.log.entries = har.log.entries.filter((entry) =>
      requests.find((r) => entry._id === r.id && entry._order === r.order)
    );
  }
}
