# Local Storage Persister

Read and write recordings to and from the browser's Local Storage.

## Usage

```js
import { Polly, LocalStoragePersister } from '@pollyjs/core';

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
