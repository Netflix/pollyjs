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
_Default_: `global`

The context object of where the `localStorage` reference exists.

__Example__

```js
polly.configure({
  persisterOptions: {
    'local-storage': {
      context: win
    }
  }
});
```

### key

_Type_: `String`
_Default_: `'pollyjs'`

The localStorage key to store the recordings data under.

__Example__

```js
polly.configure({
  persisterOptions: {
    'local-storage': {
      key: '__pollyjs__'
    }
  }
});
```
