# Express Integrations

The `@pollyjs/node-server` package exports a `registerExpressAPI` method which
takes in an [Express](http://expressjs.com/) app and a config to register the
necessary routes to be used with the REST Persister.

```js
const { registerExpressAPI } = require('@pollyjs/node-server');

registerExpressAPI(app, config);
```

## Webpack DevServer

```js
const path = require('path');
const { registerExpressAPI } = require('@pollyjs/node-server');

const config = {
  devServer: {
    before(app) {
      registerExpressAPI(app, config);
    }
  }
};

module.exports = config;
```

## Ember CLI

See the [Ember CLI Addon](frameworks/ember-cli) documentation for more details.
