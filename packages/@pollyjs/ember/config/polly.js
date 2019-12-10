/* eslint-env node */

'use strict';

module.exports = function(env) {
  // See: https://netflix.github.io/pollyjs/#/frameworks/ember-cli?id=configuration
  return {
    enabled: env !== 'production',
    server: {
      apiNamespace: '/polly',
      recordingsDir: 'recordings'
    }
  };
};
