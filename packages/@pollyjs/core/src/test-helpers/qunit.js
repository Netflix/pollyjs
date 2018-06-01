import Polly from '../polly';

function generateRecordingName(assert) {
  return assert.test.testReport.fullName.join('/');
}

export default function setupQunit(hooks, defaults = {}) {
  hooks.beforeEach(function() {
    this.polly = new Polly(generateRecordingName(...arguments), defaults);
  });

  hooks.afterEach(function() {
    return this.polly.stop();
  });
}
