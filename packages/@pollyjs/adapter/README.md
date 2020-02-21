<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.org/Netflix/pollyjs.svg?branch=master)](https://travis-ci.org/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fadapter.svg)](https://badge.fury.io/js/%40pollyjs%2Fadapter)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The `@pollyjs/adapter` package provides an extendable base adapter class that
contains core logic dependent on by the [Fetch](https://netflix.github.io/pollyjs/#/adapters/fetch)
& [XHR](https://netflix.github.io/pollyjs/#/adapters/xhr) adapters.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter -D
```

## Documentation

Check out the [Custom Adapter](https://netflix.github.io/pollyjs/#/adapters/custom)
documentation for more details.

## Usage

```js
import Adapter from '@pollyjs/adapter';

class CustomAdapter extends Adapter {
  static get id() {
    return 'custom';
  }

  onConnect() {
    /* Do something when the adapter is connect to */
  }

  onDisconnect() {
    /* Do something when the adapter is disconnected from */
  }
}
```

For better usage examples, please refer to the source code for
the [Fetch](https://github.com/Netflix/pollyjs/blob/master/packages/%40pollyjs/core/src/adapters/fetch/index.js) & [XHR](https://github.com/Netflix/pollyjs/blob/master/packages/%40pollyjs/core/src/adapters/xhr/index.js) adapters.

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
