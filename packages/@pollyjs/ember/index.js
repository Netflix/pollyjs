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

    this.app = this._findHost();

    /* try both the project and addon node module folders when resolving pollyjs plugins */
    const paths = [
      path.join(this.app.project.root, 'node_modules'),
      path.join(this.root, 'node_modules')
    ];

    this.dependencies = Object.keys(
      Object.assign({}, this.app.dependencies(), this.dependencies())
    )
      .filter(name => name !== this.name && name.startsWith('@pollyjs'))
      .map(dependency => this.lookupModule(dependency, paths))
      .filter(Boolean);

    this.dependencies.forEach(({ name, filename, main }) => {
      debug(`importing plugin "${name}" from ${main}`);
      this.import(`vendor/${name}/${filename}`, {
        using: [{ transformation: 'amd', as: name }]
      });
    });
  },

  lookupModule(dependency, paths = []) {
    let main = null;
    let isBrowserPackage = false;

    try {
      main = resolve.sync(dependency, {
        paths,
        packageFilter(pkg) {
          isBrowserPackage = !!pkg.browser;

          return pkg;
        }
      });
    } catch (e) {
      if (!e || !e.message.startsWith('Cannot find module')) {
        throw e;
      }
    }

    return isBrowserPackage
      ? {
          main,
          name: dependency,
          directory: main && path.dirname(main),
          filename: main && path.basename(main)
        }
      : null;
  },

  treeForVendor() {
    if (!this._config.enabled) {
      return;
    }

    return mergeTrees(
      this.dependencies.map(({ name, filename, directory }) => {
        return funnel(new UnwatchedDir(directory), {
          destDir: name,
          files: [filename]
        });
      })
    );
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
