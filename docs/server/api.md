# API

## HTTP Verbs

The `get`, `put`, `post`, `patch`, `delete`, `head`, and `options` HTTP verbs
are available methods on the server.

```js
server.get('/ping');
server.put('/ping');
server.post('/ping');
server.patch('/ping');
server.delete('/ping');
server.head('/ping');
server.options('/ping');
```

Each of these methods return a [Route Handler](server/route-handler.md) which
you can use to passthrough, intercept, and attach events to.

```js
server.get('/ping').passthrough();
server.put('/ping').intercept((req, res) => res.sendStatus(200));
server.post('/ping').on('beforeRequest', (req) => { /* Do Something */ });
server.patch('/ping').off('beforeRequest');
```

## any

Declare [Middleware](server/events-and-middleware#middleware) globally or for
a specific route.

__Example__

```js
server
  .any('/session/:id')
  .on('beforeRequest', (req, res) => {
    req.query.email = 'test@netflix.com';
  });
```

## host

Define a block where all methods will inherit the provided host.

__Example__

```js
server.host('http://netflix.com', () => {
  // Middleware will be attached to the host
  server
    .any()
    .on('beforeRequest', (req) => {});

  server.get('/session').intercept(() => {}); // → http://netflix.com/session
});
```

## namespace

Define a block where all methods will inherit the provided namespace.

__Example__

```js
server.namespace('/api', () => {
  // Middleware will be attached to the namespace
  server
    .any()
    .on('beforeRequest', (req) => {});

  server.get('/session').intercept(() => {}); // → /api/session

  server.namespace('/v2', () => {
    server.get('/session').intercept(() => {}); // → /api/v2/session
  })
});
```

## timeout

Returns a promise that will resolve after the given number of milliseconds.

__Example__

```js
server.get('/ping').intercept(async (req, res) => {
  await server.timeout(500);
  res.sendStatus(200);
});
```
