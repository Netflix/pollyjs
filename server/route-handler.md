# Route Handler

An object that is returned when calling any of the server's HTTP methods as well
as `server.any()`.

## Methods

?> **NOTE:** Event & Intercept handlers can be asynchronous. An `async`
function can be used or a `Promise` can be returned.

### on

Register an [event](server/events-and-middleware) handler.

?> **Tip:** You can attach multiple handlers to a single event. Handlers will be
called in the order they were declared.

| Param         | Type       | Description                                                      |
| ------------- | ---------- | ---------------------------------------------------------------- |
| eventName     | `String`   | The event name                                                   |
| handler       | `Function` | The event handler                                                |
| options       | `Object`   | The event handler options                                        |
| options.times | `number`   | Remove listener after being called the specified amount of times |

**Example**

```js
server
  .get('/session')
  .on('request', req => {
    req.headers['X-AUTH'] = '<ACCESS_TOKEN>';
    req.query.email = 'test@app.com';
  })
  .on('request', () => {
    /* Do something else */
  })
  .on(
    'request',
    () => {
      /* Do something else twice */
    },
    { times: 2 }
  );
```

### once

Register a one-time [event](server/events-and-middleware) handler.

?> **Tip:** You can attach multiple handlers to a single event. Handlers will be
called in the order they were declared.

| Param     | Type       | Description       |
| --------- | ---------- | ----------------- |
| eventName | `String`   | The event name    |
| handler   | `Function` | The event handler |

**Example**

```js
server
  .get('/session')
  .once('request', req => {
    req.headers['X-AUTH'] = '<ACCESS_TOKEN>';
    req.query.email = 'test@app.com';
  })
  .once('request', () => {
    /* Do something else */
  });
```

### off

Un-register an [event](server/events-and-middleware) handler. If no handler
is specified, all event handlers are un-registered for the given event name.

| Param     | Type       | Description       |
| --------- | ---------- | ----------------- |
| eventName | `String`   | The event name    |
| handler   | `Function` | The event handler |

**Example**

```js
const handler = () => {};

server
  .get('/session')
  .on('request', , handler)
  .on('request', () => {})
  .off('request', handler) /* Un-register the specified event/handler pair */
  .off('request'); /* Un-register all handlers */
```

### intercept

Register an intercept handler. Once set, the [request](server/request) will
never go to server but instead defer to the provided handler to handle
the [response](server/response). If multiple intercept handlers have been
registered, each handler will be called in the order in which it was registered.

| Param         | Type       | Description                                                     |
| ------------- | ---------- | --------------------------------------------------------------- |
| handler       | `Function` | The intercept handler                                           |
| options       | `Object`   | The event handler options                                       |
| options.times | `number`   | Remove handler after being called the specified amount of times |

**Example**

```js
server.any('/session').intercept((req, res) => res.sendStatus(200));

server.any('/twice').intercept((req, res) => res.sendStatus(200), { times: 2 });

server.get('/session/:id').intercept((req, res, interceptor) => {
  if (req.params.id === '1') {
    res.status(200).json({ token: 'ABC123XYZ' });
  } else if (req.params.id === '2') {
    res.status(404).json({ error: 'Unknown Session' });
  } else {
    interceptor.abort();
  }
});
```

#### Interceptor

_Extends [Event](server/event)_

The `intercept` handler receives a third `interceptor` argument that provides
some utilities.

##### abort

Calling the `abort` method on the interceptor tells the Polly instance to
continue handling the request as if it hasn't been intercepted. This allows you
to only intercept specific types of requests while opting out of others.

**Example**

```js
server.get('/session/:id').intercept((req, res, interceptor) => {
  if (req.params.id === '1') {
    res.status(200).json({ token: 'ABC123XYZ' });
  } else {
    interceptor.abort();
  }
});
```

##### passthrough

Calling the `passthrough` method on the interceptor tells the Polly instance to
continue handling the request as if it has been declared as a passthrough.
This allows you to only intercept specific types of requests while passing
others through.

**Example**

```js
server.get('/session/:id').intercept((req, res, interceptor) => {
  if (req.params.id === '1') {
    res.status(200).json({ token: 'ABC123XYZ' });
  } else {
    interceptor.passthrough();
  }
});
```

##### stopPropagation

If several intercept handlers are attached to the same route, they are called in the order in which they were added. If `stopPropagation` is invoked during one such call, no remaining handlers will be called.

**Example**

```js
// First call should return the user and not enter the 2nd handler
server
  .get('/session/:id')
  .times(1) // Remove this interceptor after it gets called once
  .intercept((req, res, interceptor) => {
    // Do not continue to the next intercept handler which handles the 404 case
    interceptor.stopPropagation();
    res.sendStatus(200);
  });

server.delete('/session/:id').intercept((req, res) => res.sendStatus(204));

// Second call should 404 since the user no longer exists
server.get('/session/:id').intercept((req, res) => res.sendStatus(404));

await fetch('/session/1'); // --> 200
await fetch('/session/1', { method: 'DELETE' }); // --> 204
await fetch('/session/1'); // --> 404
```

### passthrough

Declare a route as a passthrough meaning any request that matches that route
will directly use the native implementation. Passthrough requests will not be
recorded.

| Param       | Type      | Description                                           |
| ----------- | --------- | ----------------------------------------------------- |
| passthrough | `boolean` | Enable or disable the passthrough. Defaults to `true` |

**Example**

```js
server.any('/session').passthrough();

server.get('/session/1').passthrough(false);
```

### filter

Filter requests matched by the route handler with a predicate callback function.
This can be useful when trying to match a request by a part of the url, a header,
and/or parts of the request body.

The callback will receive the [Request](server/request)
as an argument. Return `true` to match the request, `false` otherwise.

?> Multiple filters can be chained together. They must all return `true` for the route handler to match the given request.

| Param    | Type       | Description                   |
| -------- | ---------- | ----------------------------- |
| callback | `Function` | The filter predicate function |

**Example**

```js
server
  .any()
  .filter(req => req.hasHeader('Authentication'));
  .on('request', req => {
    res.setHeader('Authentication', 'test123')
  });

server
  .get('/users/:id')
  .filter(req => req.params.id === '1');
  .intercept((req, res) => {
    res.status(200).json({ email: 'user1@test.com' });
  });
```

### times

Proceeding intercept and event handlers defined will be removed after being called the specified amount of times. The number specified is used as a default value and can be overridden by passing a custom `times` option to the handler.

| Param | Type     | Description                                                                                        |
| ----- | -------- | -------------------------------------------------------------------------------------------------- |
| times | `number` | Default times value for proceeding handlers. If no value is provided, the default value is removed |

**Example**

```js
server
  .any()
  .times(2);
  .on('request', req => {});
  .intercept((req, res) => {});
  .times()
  .on('response', (req, res) => {});

// Is the same as:

server
  .any()
  .on('request', req => {}, { times: 2 });
  .intercept((req, res) => {}, { times: 2 });
  .on('response', (req, res) => {});
```

### configure

Override configuration options for the given route. All matching middleware and route level configs are merged together and the overrides are applied to the current
Polly instance's config.

!> The following options are not supported to be overridden via the server API:
`mode`, `adapters`, `adapterOptions`, `persister`, `persisterOptions`

| Param  | Type     | Description                           |
| ------ | -------- | ------------------------------------- |
| config | `Object` | [Configuration](configuration) object |

**Example**

```js
server.any('/session').configure({ recordFailedRequests: true });

server.get('/users/:id').configure({ timing: Timing.relative(3.0) });

server.get('/users/1').configure({ logging: true });
```

### recordingName

Override the recording name for the given route. This allows for grouping common
requests to share a single recording which can drastically help de-clutter test
recordings.

For example, if your tests always make a `/users` or `/session` call, instead of
having each of those requests be recorded for every single test, you can use
this to create a common recording file for them.

| Param         | Type     | Description                                                               |
| ------------- | -------- | ------------------------------------------------------------------------- |
| recordingName | `String` | Name of the [recording](api#recordingName) to store the recordings under. |

**Example**

```js
server.any('/session').recordingName('User Session');

server.get('/users/:id').recordingName('User Data');

server
  .get('/users/1')
  .recordingName(); /* Fallback to the polly instance's recording name */
```
