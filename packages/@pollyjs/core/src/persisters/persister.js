import timestamp from '../utils/timestamp';

const SCHEMA_VERSION = 0.1;

export default class Persister {
  constructor(polly) {
    this.polly = polly;
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

    for (const [recordingId, { name, entries }] of this.pending) {
      let recording = await this.findRecording(recordingId);

      for (const { request, entry } of entries) {
        this.polly.assert(
          `Cannot persist response for [${entry.request.method}] ${
            entry.request.url
          } because the status code was ${
            entry.response.status
          } and \`recordFailedRequests\` is \`false\``,
          request.response.ok || this.polly.config.recordFailedRequests
        );

        // Add the created at timestamp to each new entry
        entry.created_at = createdAt;

        /*
          Trigger the `beforeRecord` hook on each new recorded entry.

          NOTE: This must be triggered last as this entry can be used to
                modify the payload (i.e. encrypting the request & response).
        */
        await request._trigger('beforeRecord', entry);
      }

      if (recording) {
        // If a recording already exists, merge the new entries with it
        this.addEntriesToRecording(recording, entries);
      } else {
        // If not, create a new one
        recording = this.createRecording(name, entries);

        // Add created at timestamp to the new recording
        recording.created_at = createdAt;
      }

      promises.push(this.saveRecording(recordingId, recording));
    }

    await Promise.all(promises);
    this.pending.clear();
  }

  createEntry(pollyRequest) {
    const { response } = pollyRequest;

    return {
      request: {
        url: pollyRequest.url,
        body: pollyRequest.serializedBody,
        method: pollyRequest.method,
        headers: pollyRequest.headers,
        timestamp: pollyRequest.timestamp
      },
      response: {
        status: response.statusCode,
        headers: response.headers,
        body: response.body,
        timestamp: response.timestamp
      }
    };
  }

  createRecording(name, entries) {
    const recording = {
      name,
      entries: {},
      schema_version: SCHEMA_VERSION
    };

    this.addEntriesToRecording(recording, entries);

    return recording;
  }

  addEntriesToRecording(recording, entries = []) {
    entries.forEach(({ id, order, entry }) => {
      recording.entries[id] = recording.entries[id] || [];
      recording.entries[id][order] = entry;
    });
  }

  recordRequest(pollyRequest) {
    this.polly.assert(
      `You must pass a PollyRequest to 'recordRequest'.`,
      pollyRequest
    );

    this.polly.assert(
      `Cannot save a request with no response.`,
      pollyRequest.didRespond
    );

    const { recordingId, recordingName, id, order } = pollyRequest;

    if (!this.pending.has(recordingId)) {
      this.pending.set(recordingId, { name: recordingName, entries: [] });
    }

    this.pending.get(recordingId).entries.push({
      id,
      order,
      request: pollyRequest,
      entry: this.createEntry(pollyRequest)
    });
  }

  findRecordingEntry() {
    this.polly.assert(
      '[Persister] Must implement the `findRecordingEntry` hook.',
      false
    );
  }

  findRecording() {
    this.polly.assert(
      '[Persister] Must implement the `findRecording` hook.',
      false
    );
  }

  saveRecording() {
    this.polly.assert(
      '[Persister] Must implement the `saveRecording` hook.',
      false
    );
  }

  deleteRecording() {
    this.polly.assert(
      '[Persister] Must implement the `deleteRecording` hook.',
      false
    );
  }
}
