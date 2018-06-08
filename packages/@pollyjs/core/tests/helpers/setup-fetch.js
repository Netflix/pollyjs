import xhrRequest from './xhr-request';

export default function setupFetch(fetchType) {
  beforeEach(fetchType);
  afterEach();
}

export function beforeEach(fetchType) {
  self.beforeEach(function() {
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

export function afterEach() {
  self.afterEach(async function() {
    this.polly.stop();

    await this.fetchRecord({ method: 'DELETE' });
  });
}
