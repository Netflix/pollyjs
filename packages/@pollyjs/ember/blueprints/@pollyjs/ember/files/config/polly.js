/* eslint-env node */

'use strict';

module.exports = function(env) {
  return {
    enabled: env !== 'production',
    server: {
      apiNamespace: '/polly',
      recordingsDir: 'recordings'
    }
  };
};
