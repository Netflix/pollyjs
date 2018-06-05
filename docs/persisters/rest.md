# REST Persister

Read and write recordings to and from the file system via a CRUD API hosted
on a server.

## Setup

This library provides a fully functional [node server](node-server/overview)
as well as a [CLI](cli/overview) to get you up and running.

## Usage

```js
new Polly('<Recording Name>', {
  persister: 'rest',
  persisterOptions: {
    host: '',
    apiNamespace: '/polly'
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

### apiNamespace

_Type_: `String`
_Default_: `'/polly'`

The API namespace.

The namespace the Polly API is mounted on. This should really only be changed
if there is a conflict with the default apiNamespace.

!> If modified, you must provide the new `apiNamespace` to the node server
via the [Node Server apiNamespace](node-server/overview#apinamespace) configuration
option.

__Example__

```js
polly.configure({
  persisterOptions: {
    apiNamespace: '/pollyjs'
  }
});
```
