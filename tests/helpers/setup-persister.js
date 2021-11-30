function setupPersister() {
  setupPersister.beforeEach();
  setupPersister.afterEach();
}

setupPersister.beforeEach = function () {};

setupPersister.afterEach = function () {
  afterEach(async function () {
    await this.polly.persister.deleteRecording(this.polly.recordingId);
  });
};

export default setupPersister;
