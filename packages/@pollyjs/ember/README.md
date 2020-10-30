<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.com/Netflix/pollyjs.svg?branch=master)](https://travis-ci.com/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fember.svg)](https://badge.fury.io/js/%40pollyjs%2Fember)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

Installing the `@pollyjs/ember` addon will import and vendor the necessary
Polly.JS packages as well as register the [Express API](https://netflix.github.io/pollyjs/#/node-server/express-integrations)
required by the [REST Persister](https://netflix.github.io/pollyjs/#/persisters/rest).

## Installation

```bash
ember install @pollyjs/ember
```

## Documentation

Check out the [Ember CLI Addon](https://netflix.github.io/pollyjs/#/frameworks/ember-cli)
documentation for more details.

## Configuration

Addon and [server API configuration](https://netflix.github.io/pollyjs/#/node-server/overview#api-configuration) can be specified in `<app root>/config/polly.js`. The default configuration options are shown below.

```js
module.exports = function(env) {
  return {
    // Addon Configuration Options
    enabled: env !== 'production',

    // Server Configuration Options
    server: {
      apiNamespace: '/polly',
      recordingsDir: 'recordings'
    }
  };
};
```

## Usage

Once installed and configured, you can import and use Polly as documented. Check
out the [Quick Start](https://netflix.github.io/pollyjs/#/quick-start#usage) documentation to get started.

> For an even better testing experience, check out the provided [QUnit Test Helper](https://netflix.github.io/pollyjs/#/test-frameworks/qunit)!

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
