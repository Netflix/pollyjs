# Fetch Adapter

The fetch adapter wraps the global fetch method for seamless
recording and replaying of requests.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter-fetch -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter-fetch -D
```

## Usage

Use the [configure](api#configure), [connectTo](api#connectto), and
[disconnectFrom](api#disconnectfrom) APIs to connect or disconnect from the
adapter.

```js
import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';

// Register the fetch adapter so its accessible by all future polly instances
Polly.register(FetchAdapter);

const polly = new Polly('<Recording Name>', {
  adapters: ['fetch']
});

// Disconnect using the `configure` API
polly.configure({ adapters: [] });

// Reconnect using the `connectTo` API
polly.connectTo('fetch');

// Disconnect using the `disconnectFrom` API
polly.disconnectFrom('fetch');
```

## Options

### context

_Type_: `Object`
_Default_: `global|self|window`

The context object which contains the fetch API. Typically this is `window` or `self` in the browser and `global` in node.

**Example**

```js
polly.configure({
  adapters: ['fetch'],
  adapterOptions: {
    fetch: {
      context: window
    }
  }
});
```
