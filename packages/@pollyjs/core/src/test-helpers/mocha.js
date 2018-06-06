import { afterEach, beforeEach } from './lib';

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
  setupMocha.beforeEach(defaults);
  setupMocha.afterEach();
}

setupMocha.beforeEach = function setupMochaBeforeEach(defaults) {
  self.beforeEach(function() {
    return beforeEach(this, generateRecordingName(this), defaults);
  });
};

setupMocha.afterEach = function setupMochaAfterEach() {
  self.afterEach(function() {
    return afterEach(this, 'mocha');
  });
};
