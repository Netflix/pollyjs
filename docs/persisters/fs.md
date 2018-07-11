# REST Persister

Read and write recordings to and from the file system.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/persister-fs -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/persister-fs -D
```

## Usage

```js
import { Polly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';

new Polly('<Recording Name>', {
  persister: ['fs', FSPersister]
});
```

## Options

### recordingsDir

_Type_: `String`
_Default_: `'recordings'`

The root directory to store all recordings.

__Example__

```js
polly.configure({
  persisterOptions: {
    fs: {
      recordingsDir: '__recordings__'
    }
  }
});
```