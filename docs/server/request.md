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

### json

_Type_: `Object`

The JSON parsed request body.

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
