/* globals beforeEach, afterEach */

export default function() {
  beforeEach(function() {
    this.fetch = (...args) =>
      this.page.evaluate((...args) => {
        return fetch(...args).then(res => {
          return res.text().then(body => {
            return {
              status: res.status,
              body
            };
          });
        });
      }, ...args);

    this.recordUrl = () =>
      `/api/db/${encodeURIComponent(this.polly.recordingId)}`;
    this.fetchRecord = (...args) => this.fetch(this.recordUrl(), ...args);
  });

  afterEach(async function() {
    this.polly.pause();
    await this.fetchRecord({ method: 'DELETE' });
    this.polly.play();
  });
}
