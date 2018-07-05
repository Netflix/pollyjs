# Route Handler

An object that is returned when calling any of the server's HTTP methods as well
as `server.any()`.

## Methods

?> __Note:__ Event & Intercept handlers can be asynchronous. An `async`
function can be used or a `Promise` can be returned.

### on

Register an [event](server/events-and-middleware) handler.

?> __Tip:__ You can attach multiple handlers to a single event. Handlers will be
called in the order they were declared.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| eventName | `String` | The event name |
| handler | `Function` | The event handler |

__Example__

```js
server
  .get('/session')
  .on('request', req => {
    req.headers['X-AUTH'] = '<ACCESS_TOKEN>';
    req.query.email = 'test@app.com';
  })
  .on('request', () => {/* Do something else */});
```

### off

Un-register an [event](server/events-and-middleware) handler. If no handler
is specified, all event handlers are un-registered for the given event name.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| eventName | `String` | The event name |
| handler | `Function` | The event handler |

__Example__

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
the [response](server/response).

!> __Note:__ This method is not available when using `server.any()`.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| handler | `Function` | The intercept handler |

__Example__

```js
server
  .get('/session/:id')
  .intercept((req, res, interceptor) => {
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

The `intercept` handler receives a third `interceptor` argument that provides
some utilities.

##### abort

Calling the `abort` method on the interceptor tells the Polly instance to
continue handling the request as if it hasn't been intercepted. This allows you
to only intercept specific types of requests while opting out of others.

__Example__

```js
server
  .get('/session/:id')
  .intercept((req, res, interceptor) => {
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

__Example__

```js
server
  .get('/session/:id')
  .intercept((req, res, interceptor) => {
    if (req.params.id === '1') {
      res.status(200).json({ token: 'ABC123XYZ' });
    } else {
      interceptor.passthrough();
    }
  });
```

### passthrough

The server passthrough handler. Use this to declare a route as a passthrough
meaning any request that matches that route will directly use the native
implementation. Passthrough requests will not be recorded.

!> __Note:__ This method is not available when using `server.any()`.

__Example__

```js
server.get('/session').passthrough();
```
