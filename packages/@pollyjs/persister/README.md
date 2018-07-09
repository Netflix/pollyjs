<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.org/Netflix/pollyjs.svg?branch=master)](https://travis-ci.org/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fpersister.svg)](https://badge.fury.io/js/%40pollyjs%2Fpersister)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The `@pollyjs/persister` package provides an extendable base persister class that
contains core logic dependent on by the [REST](https://netflix.github.io/pollyjs/#/persisters/rest)
& [Local Storage](https://netflix.github.io/pollyjs/#/persisters/local-storage) persisters.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/persister -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/persister -D
```

## Documentation

Check out the [Custom Persister](https://netflix.github.io/pollyjs/#/persisters/custom)
documentation for more details.

## Usage

```js
import Persister from '@pollyjs/persister';

class CustomPersister extends Persister {
  static get name() {
    return 'custom';
  }

  findRecording() {}

  saveRecording() {}

  deleteRecording() {}
}
```

For better usage examples, please refer to the source code for
the [REST](https://github.com/Netflix/pollyjs/blob/master/packages/%40pollyjs/core/src/persisters/rest/index.js) & [Local Storage](https://github.com/Netflix/pollyjs/blob/master/packages/%40pollyjs/core/src/persisters/local-storage/index.js) persisters.

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
