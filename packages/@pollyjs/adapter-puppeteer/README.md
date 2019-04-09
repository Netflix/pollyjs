<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.org/Netflix/pollyjs.svg?branch=master)](https://travis-ci.org/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fadapter-puppeteer.svg)](https://badge.fury.io/js/%40pollyjs%2Fadapter-puppeteer)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The `@pollyjs/adapter-puppeteer` package provides a [Puppeteer](https://github.com/GoogleChrome/puppeteer) adapter
to be used with `@pollyjs/core`.

## Installation

_If you're using puppeteer 1.7 or 1.8, you'll experience issues with passthrough requests. Please upgrade to the latest version of puppeteer or use a version prior to 1.7_

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter-puppeteer -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter-puppeteer -D
```

## Documentation

Check out the [Puppeteer Adapter](https://netflix.github.io/pollyjs/#/adapters/puppeteer)
documentation for more details.

## Usage

```js
import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';

Polly.register(PuppeteerAdapter);

const browser = await puppeteer.launch();
const page = await this.browser.newPage();

await page.setRequestInterception(true);

new Polly('<Recording Name>', {
  adapters: ['puppeteer'],
  adapterOptions: {
    puppeteer: { page }
  }
});

await page.goto('https://netflix.com');
```

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
