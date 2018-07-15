import xhrRequest from '@pollyjs-tests/helpers/xhr-request';

export default function setupFetch() {
  beforeEach(function() {
    if (this.polly.adapters.has('xhr')) {
      this.fetch = (...args) => xhrRequest(...args);
    } else if (this.polly.adapters.has('fetch')) {
      this.fetch = (...args) => fetch(...args);
    }
  });
}
