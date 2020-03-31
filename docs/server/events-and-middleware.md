# Events & Middleware

## Events

Events can be attached to a server route using `.on()` and detached via
the `.off()` methods.

?> **NOTE:** Event handlers can be asynchronous. An `async` function can be used
or a `Promise` can be returned.

```js
// Events
server
  .get('/')
  .on('request', req => {})
  .off('request');

// Passthrough w/ Events
server
  .get('/')
  .passthrough()
  .on('beforeResponse', (req, res) => {})
  .off('beforeResponse');

// Intercept w/ Events
server
  .get('/', (req, res) => {})
  .on('request', req => {})
  .on('beforeResponse', (req, res) => {});

// Middleware w/ Events
server
  .any('/')
  .on('request', req => {})
  .on('beforeResponse', (req, res) => {});
```

### request

Fires right before the request goes out.

| Param | Type                      | Description          |
| ----- | ------------------------- | -------------------- |
| req   | [Request](server/request) | The request instance |
| event | [Event](server/event)     | The event instance   |

**Example**

```js
server.get('/session').on('request', req => {
  req.headers['X-AUTH'] = '<ACCESS_TOKEN>';
  req.query.email = 'test@app.com';
});
```

### beforeResponse

Fires right before the response materializes and the promise resolves.

| Param | Type                        | Description           |
| ----- | --------------------------- | --------------------- |
| req   | [Request](server/request)   | The request instance  |
| res   | [Response](server/response) | The response instance |
| event | [Event](server/event)       | The event instance    |

**Example**

```js
server.get('/session').on('beforeResponse', (req, res) => {
  res.setHeader('X-AUTH', '<ACCESS_TOKEN>');
});
```

### response

Fires right after the response has been finalized for the request but before
the response materializes and the promise resolves.

| Param | Type                        | Description           |
| ----- | --------------------------- | --------------------- |
| req   | [Request](server/request)   | The request instance  |
| res   | [Response](server/response) | The response instance |
| event | [Event](server/event)       | The event instance    |

**Example**

```js
server.get('/session').on('response', (req, res) => {
  console.log(
    `${req.url} took ${req.responseTime}ms with a status of ${res.statusCode}.`
  );
});
```

### beforePersist

Fires before the request/response gets persisted.

| Param     | Type                      | Description                          |
| --------- | ------------------------- | ------------------------------------ |
| req       | [Request](server/request) | The request instance                 |
| recording | `Object`                  | The recording that will be persisted |
| event     | [Event](server/event)     | The event instance                   |

**Example**

```js
server.any().on('beforePersist', (req, recording) => {
  recording.request = encrypt(recording.request);
  recording.response = encrypt(recording.response);
});
```

### beforeReplay

Fires after retrieving the recorded request/response from the persister
and before the recording materializes into a response.

| Param     | Type                      | Description             |
| --------- | ------------------------- | ----------------------- |
| req       | [Request](server/request) | The request instance    |
| recording | `Object`                  | The retrieved recording |
| event     | [Event](server/event)     | The event instance      |

**Example**

```js
server.any().on('beforeReplay', (req, recording) => {
  recording.request = decrypt(recording.request);
  recording.response = decrypt(recording.response);
});
```

### error

Fires when any error gets emitted during the request life-cycle.

| Param | Type                      | Description          |
| ----- | ------------------------- | -------------------- |
| req   | [Request](server/request) | The request instance |
| error | Error                     | The error            |
| event | [Event](server/event)     | The event instance   |

**Example**

```js
server.any().on('error', (req, error) => {
  console.error(error);
  process.exit(1);
});
```

### abort

Fires when a request is aborted.

| Param | Type                      | Description          |
| ----- | ------------------------- | -------------------- |
| req   | [Request](server/request) | The request instance |
| event | [Event](server/event)     | The event instance   |

**Example**

```js
server.any().on('abort', req => {
  console.error('Request aborted.');
  process.exit(1);
});
```

## Middleware

Middleware can be added via the `.any()` method.

?> **NOTE:** Middleware events will be executed by the order in which they were
declared.

### Global Middleware

The following is an example of a global middleware that will be attached to all
routes. This middleware in specific overrides the `X-Auth-Token` with a test token.

```js
server.any().on('request', (req, res) => {
  req.headers['X-Auth-Token'] = 'abc123';
});
```

### Route Level Middleware

The following is an example of a route level middleware that will be attached to
any route that matches `/session/:id`. This middleware in specific overrides
the email query param with that of a test email.

```js
server.any('/session/:id').on('request', (req, res) => {
  req.query.email = 'test@netflix.com';
});
```
