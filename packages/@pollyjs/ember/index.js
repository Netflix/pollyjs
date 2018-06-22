/* eslint-env node */

'use strict';

const path = require('path');
const funnel = require('broccoli-funnel');
const resolve = require('browser-resolve');
const debug = require('debug')('@pollyjs/ember');
const mergeTrees = require('broccoli-merge-trees');
const { UnwatchedDir } = require('broccoli-source');
const { registerExpressAPI, Defaults } = require('@pollyjs/node-server');

const { assign } = Object;

module.exports = {
  name: '@pollyjs/ember',

  included() {
    this._super.included.apply(this, arguments);
    this._config = this._pollyConfig();

    if (!this._config.enabled) {
      return;
    }
  },

  serverMiddleware(startOptions) {
    this.testemMiddleware(startOptions.app);
  },

  testemMiddleware(app) {
    if (this._config.enabled) {
      registerExpressAPI(app, this._config.server);
    }
  },

  _pollyConfig() {
    const config = assign(
      {
        enabled: this.app.env !== 'production',
        server: {}
      },
      this.app.options.pollyjs
    );

    config.server.recordingsDir = path.join(
      this.app.project.root,
      config.server.recordingsDir || Defaults.recordingsDir
    );

    return config;
  }
};
