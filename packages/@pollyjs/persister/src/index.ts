import HAR from './har';
import Entry from './har/entry';
import stringify from 'fast-json-stable-stringify';
import { assert } from '@pollyjs/utils';

const CREATOR_NAME = 'Polly.JS';

export default class Persister {
  public polly: Polly;
  public pending: Map<string, { name: string, requests: PollyRequest[] }>;
  private _cache: Map<string, Promise<HAR | null>>;

  constructor(polly: Polly) {
    this.polly = polly;
    this.pending = new Map();
    this._cache = new Map();
  }

  public static get type() {
    return 'persister';
  }

  public static get name() {
    assert('Must override the static `name` getter.', false);

    return 'persister';
  }

  public get defaultOptions() {
    return {};
  }

  public get options() {
    const { name } = this.constructor;

    return {
      ...(this.defaultOptions || {}),
      ...((this.polly.config.persisterOptions || {})[name] || {})
    };
  }

  public get hasPending() {
    /*
      Although the pending map is bucketed by recordingId, the bucket will always
      be created with a single item in it so we can assume that if a bucket
      exists, then it has items in it.
    */
    return this.pending.size > 0;
  }

  public async persist() {
    if (!this.hasPending) {
      return;
    }

    const promises: Promise<void>[] = [];
    const { type, name } = this.constructor as typeof Persister;
    const creator = {
      name: CREATOR_NAME,
      version: this.polly.constructor.VERSION,
      comment: `${type}:${name}`
    };

    for (const [recordingId, { name, requests }] of this.pending) {
      const entries = [];
      const recording = await this.find(recordingId);
      let har;

      if (!recording) {
        har = new HAR({ log: { creator, _recordingName: name } } as HAR);
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

  public recordRequest(pollyRequest: PollyRequest) {
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

    this.pending.get(recordingId)!.requests.push(pollyRequest);
  }

  public async find(recordingId: string) {
    const { _cache: cache } = this;

    if (!cache.has(recordingId)) {
      const findRecording = async () => {
        const recording = await this.findRecording(recordingId);

        if (recording) {
          this.assert(
            `Recording with id '${recordingId}' is invalid. Please delete the recording so a new one can be created.`,
            recording.log && recording.log.creator!.name === CREATOR_NAME
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

  public async save(recordingId: string, har: HAR) {
    await this.saveRecording(recordingId, har);
    this._cache.delete(recordingId);
  }

  public async delete(recordingId: string) {
    await this.deleteRecording(recordingId);
    this._cache.delete(recordingId);
  }

  public async findEntry(pollyRequest: PollyRequest) {
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

  public stringify(data: any, options?: {}) {
    return stringify(data, options);
  }

  public assert(message: string, condition: boolean) {
    const { type, name } = this.constructor as typeof Persister;

    assert(`[${type}:${name}] ${message}`, condition);
  }

  public async findRecording(recordingId: string): Promise<HAR | null> {
    this.assert('Must implement the `findRecording` hook.', false);

    return null;
  }

  public async saveRecording(recordingId: string, har: HAR) {
    this.assert('Must implement the `saveRecording` hook.', false);
  }

  public async deleteRecording(recordingId: string) {
    this.assert('Must implement the `deleteRecording` hook.', false);
  }
}
