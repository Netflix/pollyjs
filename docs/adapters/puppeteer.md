# Puppeteer Adapter

The [Puppeteer](https://pptr.dev/) adapter attaches events to a given
[page](https://pptr.dev/#?product=Puppeteer&show=api-class-page) instance allowing
you to get the full power of Polly and Puppeteer.

## Installation

?> **NOTE** If you're using Puppeteer 1.7 or 1.8, you'll experience issues using passthrough requests. Please upgrade to the latest version of Puppeteer or use a version prior to 1.7.

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter-puppeteer -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter-puppeteer -D
```

## Usage

Use the [configure](api#configure), [connectTo](api#connectto), and
[disconnectFrom](api#disconnectfrom) APIs to connect or disconnect from the
adapter.

```js
import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';

// Register the puppeteer adapter so its accessible by all future polly instances
Polly.register(PuppeteerAdapter);

const browser = await puppeteer.launch();
const page = await this.browser.newPage();

await page.setRequestInterception(true);

const polly = new Polly('<Recording Name>', {
  adapters: ['puppeteer'],
  adapterOptions: {
    puppeteer: { page }
  }
});

// Disconnect using the `configure` API
polly.configure({ adapters: [] });

// Reconnect using the `connectTo` API
polly.connectTo('puppeteer');

// Disconnect using the `disconnectFrom` API
polly.disconnectFrom('puppeteer');
```

## Options

### page

_Type_: [Page](https://pptr.dev/#?product=Puppeteer&show=api-class-page)
_Default_: `null`

!> **NOTE:** This is a _required_ option.

The Puppeteer page instance Polly should attach events to in order to intercept
requests.

**Example**

```js
const browser = await puppeteer.launch();
const page = await this.browser.newPage();

await page.setRequestInterception(true);

polly.configure({
  adapters: ['puppeteer'],
  adapterOptions: {
    puppeteer: { page }
  }
});

await page.goto('http://netflix.com');
```

### requestResourceTypes

_Type_: `Array`
_Default_: `['xhr', 'fetch']`

The request [resource types](https://pptr.dev/#?product=Puppeteer&show=api-requestresourcetype)
to intercept.

**Example**

```js
polly.configure({
  adapterOptions: {
    puppeteer {
      requestResourceTypes: ['xhr']
    }
  }
});
```
