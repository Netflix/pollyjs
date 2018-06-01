import Polly from '../polly';

function generateRecordingName(context) {
  const { currentTest } = context;
  const parts = [currentTest.title];
  let parent = currentTest.parent;

  while (parent && parent.title) {
    parts.push(parent.title);
    parent = parent.parent;
  }

  return parts.reverse().join('/');
}

export default function setupMocha(defaults = {}) {
  self.beforeEach(function() {
    this.polly = new Polly(generateRecordingName(this), defaults);
  });

  self.afterEach(function() {
    return this.polly.stop();
  });
}
