# Events & Middleware

## Events

Events can be attached to a server route using `.on()` and detached via
the `.off()` methods.

?> __Note:__ Event handlers can be asynchronous. An `async` function can be used
or a promise can be returned.

```js
// Events
server
  .get('/')
  .on('beforeRequest', req => {})
  .off('beforeRequest');

// Passthrough w/ Events
server
  .get('/')
  .passthrough();
  .on('beforeResponse', (req, res) => {})
  .off('beforeResponse');

// Intercept w/ Events
server
  .get('/', (req, res) => {})
  .on('beforeRequest', req => {})
  .on('beforeResponse', (req, res) => {});

// Middleware w/ Events
server
  .any('/')
  .on('beforeRequest', req => {})
  .on('beforeResponse', (req, res) => {});
```

### beforeRequest

Fires right before the request goes out.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| req | [`Request`](server/request) | The request instance |

__Example__

```js
server
  .get('/session')
  .on('beforeRequest', req => {
    req.headers['X-AUTH'] = '<ACCESS_TOKEN>';
    req.query.email = 'test@app.com';
  });
```

### beforeResponse

Fires right before the response materializes and the promise resolves.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| req | [`Request`](server/request) | The request instance |
| res | [`Response`](server/response) | The response instance |

__Example__

```js
server
  .get('/session')
  .on('beforeResponse', (req, res) => {
    res.setHeader('X-AUTH', '<ACCESS_TOKEN>');
  });
```

### beforeRecord

Fires before the request/response gets persisted.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| req | [`Request`](server/request) | The request instance |
| event | `Object` | The event that will be persisted |

__Example__

```js
server
  .any()
  .on('beforeRecord', (req, event) => {
    event.request = encrypt(event.request);
    event.response = encrypt(event.response);
  });
```

### beforeReplay

Fires after fetching an event from the persister and before the event
materializes into a response.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| req | [`Request`](server/request) | The request instance |
| event | `Object` | The event that will be persisted |

__Example__

```js
server
  .any()
  .on('beforeReplay', (req, event) => {
    event.request = decrypt(event.request);
    event.response = decrypt(event.response);
  });
```

## Middleware

Middleware can be added via the `.any()` method.

?> __Note:__ Middleware events will be executed by the order in which they were
declared.

### Global Middleware

The following is an example of a global middleware that will be attached to all
routes. This middleware in specific overrides the `X-Auth-Token` with a test token.

```js
server
  .any()
  .on('beforeRequest', (req, res) => {
    req.headers['X-Auth-Token'] = 'abc123';
  });
```

### Route Level Middleware

The following is an example of a route level middleware that will be attached to
any route that matches `/session/:id`. This middleware in specific overrides
the email query param with that of a test email.

```js
server
  .any('/session/:id')
  .on('beforeRequest', (req, res) => {
    req.query.email = 'test@netflix.com';
  });
```
