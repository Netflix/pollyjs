/* globals beforeEach, afterEach */
import xhrRequest from './xhr-request';

export default function setupFetch() {
  beforeEachWrapper();
  afterEachWrapper();
}

function beforeEachWrapper() {
  beforeEach(function() {
    if (this.polly.adapters.has('xhr')) {
      this.fetch = (...args) => xhrRequest(...args);
    } else if (this.polly.adapters.has('fetch')) {
      this.fetch = (...args) => fetch(...args);
    } else {
      throw new TypeError(`[setupFetch] No usable network adapter.`);
    }

    this.recordUrl = () =>
      `/api/db/${encodeURIComponent(this.polly.recordingId)}`;
    this.fetchRecord = (...args) => this.fetch(this.recordUrl(), ...args);
  });
}

export function afterEachWrapper() {
  afterEach(async function() {
    this.polly.pause();
    await this.fetchRecord({ method: 'DELETE' });
    this.polly.play();
  });
}
export { beforeEachWrapper as beforeEach };
export { afterEachWrapper as afterEach };
