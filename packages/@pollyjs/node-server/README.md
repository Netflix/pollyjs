<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.org/Netflix/pollyjs.svg?branch=master)](https://travis-ci.org/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fnode-server.svg)](https://badge.fury.io/js/%40pollyjs%2Fnode-server)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The `@pollyjs/node-server` package provides a standalone node server as well as
an express integration to be able to support the [REST Persister](https://netflix.github.io/pollyjs/#/persisters/rest) so recordings can be saved to
and read from disk.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/node-server -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/node-server -D
```

## Documentation

Check out the [Node Server](https://netflix.github.io/pollyjs/#/node-server/overview)
documentation for more details.

## Server

This packages includes a fully working standalone node server that is pre-configured
with the necessary APIs and middleware to support the [REST Persister](https://netflix.github.io/pollyjs/#/persisters/rest).

The Server constructor accepts a configuration object that can be a combination
of the below listed Server & API options. Once instantiated, you will have
full access to the Express app via the `app` property.

```js
const { Server } = require('@pollyjs/node-server');
const server = new Server({
  quiet: true,
  port: 4000,
  apiNamespace: '/pollyjs'
});

// Add custom business logic to the express server
server.app.get('/custom', () => {
  /* Add custom express logic */
});

// Start listening and attach extra logic to the http server
server.listen().on('error', () => {
  /* Add http server error logic */
});
```

## Express Integrations

The `@pollyjs/node-server` package exports a `registerExpressAPI` method which
takes in an [Express](http://expressjs.com/) app and a config to register the
necessary routes to be used with the REST Persister.

```js
const { registerExpressAPI } = require('@pollyjs/node-server');

registerExpressAPI(app, config);
```

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
