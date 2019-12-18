# REST Persister

Read and write recordings to and from the file system via a CRUD API hosted
on a server.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/persister-rest -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/persister-rest -D
```

## Setup

This library provides a fully functional [node server](node-server/overview)
as well as a [CLI](cli/overview) to get you up and running.

## Usage

```js
import { Polly } from '@pollyjs/core';
import RESTPersister from '@pollyjs/persister-rest';

// Register the rest persister so its accessible by all future polly instances
Polly.register(RESTPersister);

new Polly('<Recording Name>', {
  persister: 'rest'
});
```

## Options

### host

_Type_: `String`
_Default_: `'http://localhost:3000'`

The host that the API exists on.

**Example**

```js
polly.configure({
  persisterOptions: {
    rest: {
      host: 'http://localhost.com:4000'
    }
  }
});
```

### apiNamespace

_Type_: `String`
_Default_: `'/polly'`

The API namespace.

The namespace the Polly API is mounted on. This should really only be changed
if there is a conflict with the default apiNamespace.

!> If modified, you must provide the new `apiNamespace` to the node server
via the [Node Server apiNamespace](node-server/overview#apinamespace) configuration
option.

**Example**

```js
polly.configure({
  persisterOptions: {
    rest: {
      apiNamespace: '/polly'
    }
  }
});
```
