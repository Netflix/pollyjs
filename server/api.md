# API

## HTTP Methods

The `GET`, `PUT`, `POST`, `PATCH`, `DELETE`, `MERGE`, `HEAD`, and `OPTIONS` HTTP methods
have a corresponding method on the server instance.

```js
server.get('/ping');
server.put('/ping');
server.post('/ping');
server.patch('/ping');
server.delete('/ping');
server.merge('/ping');
server.head('/ping');
server.options('/ping');
```

Each of these methods returns a [Route Handler](server/route-handler.md) which
you can use to pass-through, intercept, and attach events to.

```js
server.get('/ping').passthrough();
server.put('/ping').intercept((req, res) => res.sendStatus(200));
server.post('/ping').on('request', req => {
  /* Do Something */
});
server.patch('/ping').off('request');
```

## any

Declare [Events & Middleware](server/events-and-middleware#middleware) globally
or for a specific route.

**Example**

```js
server.any('/session/:id').on('request', (req, res) => {
  req.query.email = 'test@netflix.com';
});
```

## host

Define a block where all methods will inherit the provided host.

**Example**

```js
server.host('http://netflix.com', () => {
  // Middleware will be attached to the host
  server.any().on('request', req => {});

  server.get('/session').intercept(() => {}); // → http://netflix.com/session
});
```

## namespace

Define a block where all methods will inherit the provided namespace.

**Example**

```js
server.namespace('/api', () => {
  // Middleware will be attached to the namespace
  server.any().on('request', req => {});

  server.get('/session').intercept(() => {}); // → /api/session

  server.namespace('/v2', () => {
    server.get('/session').intercept(() => {}); // → /api/v2/session
  });
});
```

## timeout

Returns a promise that will resolve after the given number of milliseconds.

**Example**

```js
server.get('/ping').intercept(async (req, res) => {
  await server.timeout(500);
  res.sendStatus(200);
});
```
