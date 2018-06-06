# API

## Constructor

Create a new Polly instance.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| recordingName | `String` | Name of the [recording](api#recordingName) to store the recordings under. |
| config | `Object` | [Configuration](configuration) object |
| __Returns__ | `Polly` | &nbsp; |

__Example__

```js
new Polly('<Recording Name>', { /* ... */ });
```

## Properties

### recordingName

_Type_: `String`
_Default_: `null`

The recording name the recordings will be stored under. The provided name is
sanitized as well as postfixed with a GUID.

__Example__

```js
new Polly('Wants a Cracker', { /* ... */ });
```

Will save recordings to the following file:

```text
recordings
  └── Wants-a-Cracker_1234
      └── recording.json
```

__Example__

?> A recording can also have slashes to better organize recordings.

```js
new Polly('Wants a Cracker/Cheddar');
```

Will save recordings to the following file:

```text
recordings
  └── Wants-a-Cracker_1234
      └── Cheddar_5678
          └── recording.json
```

### mode

_Type_: `String`
_Default_: `'replay'`

The current [mode](configuration#mode) polly is in.

__Example__

```js
const polly = new Polly();

polly.mode // → 'replay'
polly.record();
polly.mode // → 'record'
```

### Modes

_Type_: `Object`

A static object of all the possible modes a polly can be in.

[modes.js](https://raw.githubusercontent.com/Netflix/pollyjs/master/packages/@pollyjs/core/src/defaults/modes.js ':include :type=code') →


### persister

_Type_: `Persister`
_Default_: `RestPersister`

The persister used to find and save recordings.

### server

_Type_: `Server`
_Default_: `Server`

Every polly instance has a reference to a [client side server](server/overview) which you can leverage
to gain full control of all HTTP interactions as well as dictate how the Polly instance
should handle them.

```js
const { server } = polly;

server.get('/movies').passthrough();
server.get('/series').intercept((req, res) => res.sendStatus(200));
```

## Methods

### configure

Configure polly with the given configuration object.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| config | `Object` | [Configuration](configuration) object |

__Example__

```js
polly.configure({ recordIfMissing: false });
```

### record

Puts polly in recording mode. All requests going forward will
be sent to the server and their responses will be recorded.

__Example__

```js
polly.record();
```

### replay

Puts polly in replay mode. All requests going forward will be
played back from a saved recording.

__Example__

```js
polly.replay();
```

### pause

Puts polly in a paused mode. All requests going forward will pass through
and will not be recorded or replayed. The previous mode will be saved and can
be restored by calling [play](api#play)

__Example__

```js
// polly.mode === 'replay'
polly.pause();
// polly.mode === 'passthrough'
```

### play

Restores the mode to the one before [pause](api#pause) was called.

__Example__

```js
// polly.mode === 'replay'
polly.pause();
// polly.mode === 'passthrough'
polly.play();
// polly.mode === 'replay'
```

### stop

Persist all recordings and disconnect from all adapters.

!> This method is `async` and will resolve once all recordings have
persisted and the instance has successfully torn down.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| Returns | `Promise` | &nbsp; |

__Example__

```js
await polly.stop();
```

### connectTo

Connect to an adapter.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the adapter to connect to |

__Example__

```js
polly.connectTo('xhr');
```

### disconnectFrom

Disconnect from an adapter.

| Param | Type | Description |
|  ---  | ---  |     ---     |
| name | `String` | The name of the adapter to disconnect from |

__Example__

```js
polly.disconnectFrom('xhr');
```

### disconnect

Disconnect from all connected adapters.

__Example__

```js
polly.disconnect();
```
