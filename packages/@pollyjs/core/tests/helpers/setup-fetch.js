import xhrRequest from './xhr-request';

export default function setupFetch(fetchType) {
  beforeEachWrapper(fetchType);
  afterEachWrapper();
}

function beforeEachWrapper(fetchType) {
  beforeEach(function() {
    this.fetch = (...args) => {
      if (fetchType === 'xhr') {
        return xhrRequest(...args);
      } else if (fetchType === 'fetch') {
        return fetch(...args);
      } else {
        throw new TypeError(`Unknown fetch type: ${fetchType}.`);
      }
    };

    this.recordUrl = () =>
      `/api/db/${encodeURIComponent(this.polly.recordingId)}`;
    this.fetchRecord = (...args) => this.fetch(this.recordUrl(), ...args);
  });
}

export function afterEachWrapper() {
  afterEach(async function() {
    this.polly.stop();

    await this.fetchRecord({ method: 'DELETE' });
  });
}
export { beforeEachWrapper as beforeEach };
export { afterEachWrapper as afterEach };
