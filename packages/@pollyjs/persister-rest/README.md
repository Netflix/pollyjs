<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.org/Netflix/pollyjs.svg?branch=master)](https://travis-ci.org/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fpersister-rest.svg)](https://badge.fury.io/js/%40pollyjs%2Fpersister-rest)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The `@pollyjs/persister-rest` package provides a REST API persister that allows
to read and write recordings to and from the file system via a CRUD API hosted
on a server.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/persister-rest -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/persister-rest -D
```

## Documentation

Check out the [REST Persister](https://netflix.github.io/pollyjs/#/persisters/rest)
documentation for more details.

## Usage

```js
import { Polly } from '@pollyjs/core';
import RESTPersister from '@pollyjs/persister-rest';

Polly.register(RESTPersister);

new Polly('<Recording Name>', {
  persister: 'rest'
});
```

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
