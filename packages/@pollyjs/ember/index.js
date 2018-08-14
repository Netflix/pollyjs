/* eslint-env node */

'use strict';

const path = require('path');
const { registerExpressAPI, Defaults } = require('@pollyjs/node-server');

const { assign } = Object;

module.exports = {
  name: '@pollyjs/ember',

  included() {
    this._super.included.apply(this, arguments);

    this._config = this._pollyConfig();
  },

  treeForAddon() {
    if (!this._config.enabled) {
      return;
    }

    return this._super.treeForAddon.apply(this, arguments);
  },

  contentFor(name) {
    if (name !== 'body-footer' || !this._config.enabled) {
      return;
    }

    return `
      <script type="text/javascript">
        (function() {
          'use strict';
          require('@pollyjs/ember/-private/preconfigure');
        })();
      </script>
    `;
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
