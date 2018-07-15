<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.org/Netflix/pollyjs.svg?branch=master)](https://travis-ci.org/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fadapter-fetch.svg)](https://badge.fury.io/js/%40pollyjs%2Fadapter-fetch)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The `@pollyjs/adapter-fetch` package provides a fetch adapter that wraps the
global fetch method for seamless recording and replaying of requests.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter-fetch -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter-fetch -D
```

## Documentation

Check out the [Fetch Adapter](https://netflix.github.io/pollyjs/#/adapters/fetch)
documentation for more details.

## Usage

```js
import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';

Polly.register(FetchAdapter);

new Polly('<Recording Name>', {
  adapters: ['fetch']
});
```

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
