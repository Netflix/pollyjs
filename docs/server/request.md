# Request

## Methods

### getHeader

Get a header with a given name.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the header |
| __Returns__ | `String` | The header value |

__Example__

```js
req.getHeader('Content-Type'); // → application/json
```

### setHeader

Set a header with a given name. If the value is falsy, the header will be
removed.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the header |
| value | `String` | The value for the header |
| __Returns__ | [Request](server/request) | The current request |

__Example__

```js
req.setHeader('Content-Length', 42);
```

### setHeaders

Add multiple headers at once. A falsy header value will remove that header
altogether.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| headers | `Object` | The headers to add to the request |
| __Returns__ | [Request](server/request) | The current request |

__Example__

```js
req.setHeaders({
  'Content-Type': 'application/json',
  'Content-Length': 42
});
```

### hasHeader

Returns 'true' or 'false' depending on if the request has the given header.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the header |
| __Returns__ | `Boolean` | &nbsp; |

__Example__

```js
req.hasHeader('X-AUTH'); // → false
```

### type

Sets the request's Content Type.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| value | `String` | &nbsp; |
| __Returns__ | [Request](server/request) | The current request |

### send

Sets the request's body.

- If the body is a `String`, it defaults the content type to `text/html` if does not exist.
- If the body is a `String` and no charset is found, a `utf-8` charset is appended to the content type.
- Body that is a `Boolean`, `Number`, or `Object` gets passed to the [json](#json) method.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| body | `any` | &nbsp; |
| __Returns__ | [Request](server/request) | The current request |

__Example__

```js
req.send('Hello World');
req.send(200);
req.send(true);
req.send();
```

### json

A shortcut method to set the content type to `application/json` if it hasn't
been set already, and call [send](#send) with the stringified object.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| obj | `Object` | Object to send |
| __Returns__ | [Request](server/request) | The current request |

__Example__

```js
req.json({ Hello: 'World' });
```

### jsonBody

A shortcut method that calls JSON.parse on the request's body.

!> This method will throw if the body is an invalid JSON string.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| __Returns__ | `Object` | The JSON parsed body |

__Example__

```js
req.jsonBody();
```

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

__Example__

```js
server.get('/movies/:id').intercept((req, res) => {
  console.log(req.params.id);
});
```

### recordingName

_Type_: `String`

The recording the request should be recorded under.
