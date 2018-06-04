# Overview

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/node-server -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/node-server -D
```

## Integrations

The `@pollyjs/node-server` packages provides a `registerExpressAPI` method which
takes in an [Express](http://expressjs.com/) app and a config to register the
necessary routes to be used with the REST Persister.

### Webpack DevServer

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

### Ember CLI

See the [Ember CLI documentation](frameworks/ember-cli) for more details.

## Configuration

### recordingsDir

_Type_: `String`
_Default_: `'recordings'`

The root directory to store all recordings.

```js
registerExpressAPI(app, {
  recordingsDir: '__recordings__'
});
```

### apiNamespace

_Type_: `String`
_Default_: `'polly'`

The API namespace for the routes.

```js
registerExpressAPI(app, {
  apiNamespace: 'polly_js'
});
```
