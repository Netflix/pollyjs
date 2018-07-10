# Custom Adapter

If you need to create your own adapter or modify an pre-existing one, you've come
to the right page!

## Creating a Custom Adapter

The `@pollyjs/adapter` package provides an extendable base adapter class that
contains core logic dependent on by the [Fetch](adapters/fetch)
& [XHR](adapters/xhr) adapters.

### Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter -D
```

### Usage

```js
import Adapter from '@pollyjs/adapter';

class CustomAdapter extends Adapter {
  static get name() {
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

## Extending from an Existing Adapter

The `@pollyjs/core` package exports the `XHRAdapter` and `FetchAdapter` classes,
allowing you to modify them as needed.

```js
import { XHRAdapter, FetchAdapter } from '@pollyjs/core';

class CustomXHRAdapter extends XHRAdapter {}
class CustomFetchAdapter extends FetchAdapter {}
```

## Registering & Connecting to a Custom Adapter

You can register and connect to a custom adapter by passing an array to the `adapters`
config where the first element is the name of your adapter and the second is the
adapter class.

```js
// Register and connect to a custom adapter:
new Polly('Custom Adapter', {
  adapters: [
    ['my-custom-adapter', MyCustomAdapterClass]
  ]
});

// Register and connect to the default adapters + a custom adapter:
new Polly('Defaults + Custom Adapter', {
  adapters: [
    'fetch',
    'xhr',
    ['my-custom-adapter', MyCustomAdapterClass]
  ]
});

// Register and connect to a custom fetch adapter:
new Polly('Custom Fetch Adapter', {
  adapters: [
    ['fetch', MyCustomFetchAdapterClass]
  ]
});

// Register and connect to a custom adapter via .configure():
const polly = new Polly('Custom Adapter');

polly.configure({
  adapters: [
    ['my-custom-adapter', MyCustomAdapterClass]
  ]
});
```
