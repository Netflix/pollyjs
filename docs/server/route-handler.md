# Route Handler

An object that is returned when calling any of the server's HTTP methods as well
as `server.any()`.

## Methods

?> __Note:__ Event & Intercept handlers can be asynchronous. An `async`
function can be used or a promise can be returned.

### on

Register an [event](server/events-and-middleware) handler.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| eventName | `String` | The event name |
| handler | `Function` | The event handler |

__Example__

```js
server
  .get('/session')
  .on('beforeRequest', req => {
    req.headers['X-AUTH'] = '<ACCESS_TOKEN>';
    req.query.email = 'test@app.com';
  });
```

### off

Un-register an [event](server/events-and-middleware) handler.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| eventName | `String` | The event name |

__Example__

```js
server
  .get('/session')
  .off('beforeRequest');
```

### intercept

Register an intercept handler.

!> __Note:__ This method is not available when using `server.any()`.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| handler | `Function` | The intercept handler |

__Example__

```js
server
  .get('/session/:id')
  .intercept((req, res) => {
    if (req.params.id === '1') {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Unknown Session' });
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
