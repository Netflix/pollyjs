# REST Persister

The REST adapter uses an API to talk to a server to read and write recordings
from the file system.

## Setup

This library provides a fully functional node server to get you up and running.
Please refer to the [Node Server Overview](node-server/overview) documentation
to get set up.

## Usage

```js
const polly = new Polly('<Recording>', {
  persister: 'rest',
  persisterOptions: {
    host: '',
    namespace: '/polly'
  }
});
```

## Options

### host

_Type_: `String`
_Default_: `''`

The host that the API exists on.

__Example__

```js
polly.configure({
  persisterOptions: {
    host: 'http://netflix.com:3000'
  }
});
```

### namespace

_Type_: `String`
_Default_: `'/polly'`

The API namespace.

!> If overriding the namespace, the same option must be provided to the node
server. See [Node Server: Namespace](node-server/overview#namespace) for more
details.

__Example__

```js
polly.configure({
  persisterOptions: {
    namespace: '/pollyjs'
  }
});
```
