const defaultOptions = {
  host: '',
  fetch() {
    return global.fetch(...arguments);
  }
};

function setupFetchRecord(options) {
  setupFetchRecord.beforeEach(options);
  setupFetchRecord.afterEach();
}

setupFetchRecord.beforeEach = function(options = {}) {
  options = { ...defaultOptions, ...options };

  beforeEach(function() {
    const { host, fetch } = options;

    this.fetch = fetch && fetch.bind(this);

    if (!this.fetch) {
      throw new Error('[setup-fetch-record] `this.fetch` not set.');
    }

    this.recordUrl = () =>
      `${host}/api/db/${encodeURIComponent(this.polly.recordingId)}`;

    this.fetchRecord = (...args) => this.fetch(this.recordUrl(), ...args);
  });
};

setupFetchRecord.afterEach = function() {
  afterEach(async function() {
    this.polly.pause();
    await this.fetchRecord({ method: 'DELETE' });
    this.polly.play();
  });
};

export default setupFetchRecord;
