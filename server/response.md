# Response

## Properties

### statusCode

_Type_: `Number`
_Default_: `undefined`

The response's status code.

### headers

_Type_: `Object`
_Default_: `{}`

The response's headers.

### body

_Type_: `String`
_Default_: `undefined`

The response's body.

## Methods

### status

Set the response's status code.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| status | `Number` | Status code |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.status(200);
```

### getHeader

Get a header with a given name.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the header |
| __Returns__ | `String` | The header value |

__Example__

```js
res.getHeader('Content-Type'); // → application/json
```

### setHeader

Set a header with a given name. If the value is falsy, the header will be
removed.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the header |
| value | `String` | The value for the header |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.setHeader('Content-Length', 42);
```

### setHeaders

Add multiple headers at once. A falsy header value will remove that header
altogether.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| headers | `Object` | The headers to add to the response |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.setHeaders({
  'Content-Type': 'application/json',
  'Content-Length': 42
});
```

### hasHeader

Returns 'true' or 'false' depending on if the response has the given header.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the header |
| __Returns__ | `Boolean` | &nbsp; |

__Example__

```js
res.hasHeader('X-AUTH'); // → false
```

### type

Sets the response's Content Type.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| value | `String` | &nbsp; |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.type('application/json');
```

### send

Sets the response's body.

- If the body is a `String`, it defaults the content type to `text/html` if does not exist.
- If the body is a `String` and no charset is found, a `utf-8` charset is appended to the content type.
- Body that is a `Boolean`, `Number`, or `Object` gets passed to the [json](#json) method.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| body | `any` | &nbsp; |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.send('Hello World');
res.send(200);
res.send(true);
res.send();
```

### sendStatus

A shortcut method to set the status to the given status code, set the content
type to `text/plain`, and call [send](#send).

| Param | Type | Description |
|  ---  | ---  |     ---     |
| status | `Number` | Status code |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.sendStatus(200);
```

### json

A shortcut method to set the content type to `application/json` if it hasn't
been set already, and call [send](#send) with the stringified object.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| obj | `Object` | Object to send |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.json({ Hello: 'World' });
```

### jsonBody

A shortcut method that calls JSON.parse on the response's body.

!> This method will throw if the body is an invalid JSON string.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| __Returns__ | `Object` | The JSON parsed body |

__Example__

```js
res.jsonBody();
```

### end

Freeze the response and headers so they can no longer be modified.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| __Returns__ | [Response](server/response) | The current response |

__Example__

```js
res.end();
```
