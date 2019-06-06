# XHR Adapter

The XHR adapter uses Sinon's [Nise](https://github.com/sinonjs/nise) library
to fake the global `XMLHttpRequest` object while wrapping the native one to allow
for seamless recording and replaying of requests.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter-xhr -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter-xhr -D
```

## Usage

Use the [configure](api#configure), [connectTo](api#connectto), and
[disconnectFrom](api#disconnectfrom) APIs to connect or disconnect from the
adapter.

```js
import { Polly } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';

// Register the xhr adapter so its accessible by all future polly instances
Polly.register(XHRAdapter);

const polly = new Polly('<Recording Name>', {
  adapters: ['xhr']
});

// Disconnect using the `configure` API
polly.configure({ adapters: [] });

// Reconnect using the `connectTo` API
polly.connectTo('xhr');

// Disconnect using the `disconnectFrom` API
polly.disconnectFrom('xhr');
```

## Options

### context

_Type_: `Object`
_Default_: `global|self|window`

The context object which contains the XMLHttpRequest object. Typically this is `window` or `self` in the browser and `global` in node.

**Example**

```js
polly.configure({
  adapters: ['xhr'],
  adapterOptions: {
    xhr: {
      context: window
    }
  }
});
```
