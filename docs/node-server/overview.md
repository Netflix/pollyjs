# Overview

The `@pollyjs/node-server` package provides a standalone node server as well as
an express integration to be able to support the [REST Persister](persisters/rest)
so recordings can be saved to and read from disk.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/node-server -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/node-server -D
```

## Server

This packages includes a fully working standalone node server that is pre-configured
with the necessary APIs and middleware to support the [REST Persister](persisters/rest).

The Server constructor accepts a configuration object that can be a combination
of the below listed Server & API options. Once instantiated, you will have
full access to the Express app via the `app` property.

```js
const { Server } = require('@pollyjs/node-server');
const server = new Server({
  quiet: true,
  port: 4000,
  apiNamespace: '/polly'
});

// Add custom business logic to the express server
server.app.get('/custom', () => {
  /* Add custom express logic */
});

// Start listening and attach extra logic to the http server
server.listen().on('error', () => {
  /* Add http server error logic */
});
```

## Server Configuration

### port

_Type_: `Number`
_Default_: `3000`

```js
new Server({
  port: 4000
});
```

### host

_Type_: `String`
_Default_: `undefined`

```js
new Server({
  host: 'test.localhost'
});
```

### quiet

_Type_: `Boolean`
_Default_: `false`

Enable/Disable the logging middleware ([morgan](https://github.com/expressjs/morgan)).

```js
new Server({
  quiet: true
});
```

## API Configuration

### recordingsDir

_Type_: `String`
_Default_: `'recordings'`

The root directory to store all recordings.

```js
new Server({
  recordingsDir: '__recordings__'
});

registerExpressAPI(app, {
  recordingsDir: '__recordings__'
});
```

### apiNamespace

_Type_: `String`
_Default_: `'polly'`

The namespace to mount the polly API on. This should really only be changed
if there is a conflict with the default apiNamespace.

!> If modified, you must provide the new `apiNamespace` to the client side Polly
instance via the [Persister Options](persisters/rest#apinamespace)

```js
new Server({
  apiNamespace: '/polly'
});

registerExpressAPI(app, {
  apiNamespace: '/polly'
});
```

### recordingSizeLimit

_Type_: `String`
_Default_: `'50mb'`

A recording size can not exceed 50mb by default. If your application exceeds this limit, bump this value to a reasonable limit.

```js
new Server({
  recordingSizeLimit: '50mb'
});

registerExpressAPI(app, {
  recordingSizeLimit: '50mb'
});
```
