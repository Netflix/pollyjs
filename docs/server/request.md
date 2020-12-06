# Request

## Properties

### method

_Type_: `String`

The request method. (e.g. `GET`, `POST`, `DELETE`)

### url

_Type_: `String`

The request URL.

### protocol

_Type_: `String`

The request url protocol. (e.g. `http://`, `https:`)

### hostname

_Type_: `String`

The request url host name. (e.g. `localhost`, `netflix.com`)

### port

_Type_: `String`

The request url port. (e.g. `3000`)

### pathname

_Type_: `String`

The request url path name. (e.g. `/session`, `/movies/1`)

### hash

_Type_: `String`

The request url hash.

### headers

_Type_: `Object`
_Default_: `{}`

The request headers.

### body

_Type_: `any`

The request body.

### query

_Type_: `Object`
_Default_: `{}`

The request url query parameters.

### params

_Type_: `Object`
_Default_: `{}`

The matching route's path params.

**Example**

```js
server.get('/movies/:id').intercept((req, res) => {
  console.log(req.params.id);
});
```

### recordingName

_Type_: `String`

The recording the request should be recorded under.

## Methods

### getHeader

Get a header with a given name.

| Param       | Type             | Description            |
| ----------- | ---------------- | ---------------------- |
| name        | `String`         | The name of the header |
| **Returns** | `String | Array` | The header value       |

**Example**

```js
req.getHeader('Content-Type'); // → application/json
```

### setHeader

Set a header with a given name. If the value is `null` or `undefined`, the header will be
removed.

| Param       | Type                      | Description              |
| ----------- | ------------------------- | ------------------------ |
| name        | `String`                  | The name of the header   |
| value       | `String | Array`          | The value for the header |
| **Returns** | [Request](server/request) | The current request      |

**Example**

```js
req.setHeader('Content-Length', 42);
```

### setHeaders

Add multiple headers at once. If a value is `null` or `undefined`, the header will be
removed.

| Param       | Type                      | Description                       |
| ----------- | ------------------------- | --------------------------------- |
| headers     | `Object`                  | The headers to add to the request |
| **Returns** | [Request](server/request) | The current request               |

**Example**

```js
req.setHeaders({
  Accept: ['text/html', 'image/*'],
  'Content-Type': 'application/json',
  'Content-Length': 42
});
```

### removeHeader

Remove a header with the given name.

| Param       | Type                      | Description            |
| ----------- | ------------------------- | ---------------------- |
| name        | `String`                  | The name of the header |
| **Returns** | [Request](server/request) | The current request    |

**Example**

```js
req.removeHeader('Content-Length');
```

### removeHeaders

Remove multiple headers at once.

| Param       | Type                      | Description                            |
| ----------- | ------------------------- | -------------------------------------- |
| headers     | `Array`                   | The headers to remove from the request |
| **Returns** | [Request](server/request) | The current request                    |

**Example**

```js
req.removeHeaders(['Content-Type' 'Content-Length']);
```

### hasHeader

Returns 'true' or 'false' depending on if the request has the given header.

| Param       | Type      | Description            |
| ----------- | --------- | ---------------------- |
| name        | `String`  | The name of the header |
| **Returns** | `Boolean` | &nbsp;                 |

**Example**

```js
req.hasHeader('X-AUTH'); // → false
```

### type

Sets the request's Content Type.

| Param       | Type                      | Description         |
| ----------- | ------------------------- | ------------------- |
| value       | `String`                  | &nbsp;              |
| **Returns** | [Request](server/request) | The current request |

### send

Sets the request's body.

- If the body is a `String`, it defaults the content type to `text/html` if does not exist.
- If the body is a `String` and no charset is found, a `utf-8` charset is appended to the content type.
- Body that is a `Boolean`, `Number`, or `Object` gets passed to the [json](#json) method.

| Param       | Type                      | Description         |
| ----------- | ------------------------- | ------------------- |
| body        | `any`                     | &nbsp;              |
| **Returns** | [Request](server/request) | The current request |

**Example**

```js
req.send('Hello World');
req.send(200);
req.send(true);
req.send();
```

### json

A shortcut method to set the content type to `application/json` if it hasn't
been set already, and call [send](#send) with the stringified object.

| Param       | Type                      | Description         |
| ----------- | ------------------------- | ------------------- |
| obj         | `Object`                  | Object to send      |
| **Returns** | [Request](server/request) | The current request |

**Example**

```js
req.json({ Hello: 'World' });
```

### jsonBody

A shortcut method that calls JSON.parse on the request's body.

!> This method will throw if the body is an invalid JSON string.

| Param       | Type     | Description          |
| ----------- | -------- | -------------------- |
| **Returns** | `Object` | The JSON parsed body |

**Example**

```js
req.jsonBody();
```

### overrideRecordingName

Override the recording name for the request.

| Param         | Type     | Description            |
| ------------- | -------- | ---------------------- |
| recordingName | `String` | The new recording name |

**Example**

```js
req.overrideRecordingName(req.hostname);
```

### configure

Override configuration options for the request.

| Param  | Type     | Description                           |
| ------ | -------- | ------------------------------------- |
| config | `Object` | [Configuration](configuration) object |

**Example**

```js
req.configure({ recordFailedRequests: true });

req.configure({ timing: Timing.relative(3.0) });

req.configure({ logging: true });
```
