import { afterEach, beforeEach } from './lib';

function generateRecordingName(assert) {
  return assert.test.testReport.fullName.join('/');
}

export default function setupQunit(hooks, defaults = {}) {
  setupQunit.beforeEach(hooks, defaults);
  setupQunit.afterEach(hooks);
}

setupQunit.beforeEach = function setupQunitBeforeEach(hooks, defaults = {}) {
  hooks.beforeEach(function() {
    return beforeEach(this, generateRecordingName(...arguments), defaults);
  });
};

setupQunit.afterEach = function setupQunitAfterEach(hooks) {
  hooks.afterEach(function() {
    return afterEach(this, 'qunit');
  });
};
