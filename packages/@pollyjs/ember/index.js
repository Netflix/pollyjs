/* eslint-env node */

'use strict';

const fs = require('fs');
const path = require('path');
const { registerExpressAPI, Defaults } = require('@pollyjs/node-server');
const parseArgs = require('minimist');

function determineEnv() {
  if (process.env.EMBER_ENV) {
    return process.env.EMBER_ENV;
  }

  let args = parseArgs(process.argv);
  let env = args.e || args.env || args.environment;

  // Is it "ember b -prod" or "ember build --prod" command?
  if (
    !env &&
    (process.argv.indexOf('-prod') > -1 || process.argv.indexOf('--prod') > -1)
  ) {
    env = 'production';
  }

  // Is it "ember test" or "ember t" command without explicit env specified?
  if (
    !env &&
    (process.argv.indexOf('test') > -1 || process.argv.indexOf('t') > -1)
  ) {
    env = 'test';
  }

  return env || 'development';
}

module.exports = {
  name: require('./package').name,
  _config: null,

  init() {
    // see: https://github.com/ember-cli/ember-cli/blob/725e129e62bccbf21af55b21180edb8966781f53/lib/models/addon.js#L258
    this._super.init && this._super.init.apply(this, arguments);

    const env = determineEnv();

    this._config = this._pollyConfig(env);
  },

  treeForAddon() {
    if (!this._config.enabled) {
      return;
    }

    return this._super.treeForAddon.apply(this, arguments);
  },

  contentFor(name) {
    if (name !== 'app-prefix' || !this._config.enabled) {
      return;
    }

    return `
      (function() {
        'use strict';
        require('@pollyjs/ember/-private/preconfigure');
      })();
    `;
  },

  _pollyConfig(env) {
    // defaults
    let config = {
      enabled: env !== 'production',
      server: {}
    };

    let configPath = path.join(this.project.root, 'config', 'polly.js');

    if (fs.existsSync(configPath)) {
      let configGenerator = require(configPath);

      Object.assign(config, configGenerator(env));
    }

    config.server.recordingsDir = path.join(
      this.project.root,
      config.server.recordingsDir || Defaults.recordingsDir
    );

    return config;
  },

  serverMiddleware(startOptions) {
    this.testemMiddleware(startOptions.app);
  },

  testemMiddleware(app) {
    if (this._config.enabled) {
      registerExpressAPI(app, this._config.server);
    }
  }
};
