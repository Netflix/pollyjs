# Local Storage Persister

Read and write recordings to and from the browser's Local Storage.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/persister-local-storage -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/persister-local-storage -D
```

## Usage

```js
import { Polly } from '@pollyjs/core';
import LocalStoragePersister from '@pollyjs/persister-local-storage';

// Register the local-storage persister so its accessible by all future polly instances
Polly.register(LocalStoragePersister);

new Polly('<Recording Name>', {
  persister: 'local-storage'
});
```

## Options

### context

_Type_: `Object`
_Default_: `global|self|window`

The context object which contains the localStorage API.
Typically this is `window` or `self` in the browser and `global` in node.

**Example**

```js
polly.configure({
  persisterOptions: {
    'local-storage': {
      context: window
    }
  }
});
```

### key

_Type_: `String`
_Default_: `'pollyjs'`

The localStorage key to store the recordings data under.

**Example**

```js
polly.configure({
  persisterOptions: {
    'local-storage': {
      key: '__pollyjs__'
    }
  }
});
```
