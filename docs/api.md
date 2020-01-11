# API

## Constructor

Create a new Polly instance.

| Param         | Type     | Description                                                               |
| ------------- | -------- | ------------------------------------------------------------------------- |
| recordingName | `String` | Name of the [recording](api#recordingName) to store the recordings under. |
| config        | `Object` | [Configuration](configuration) object                                     |
| **Returns**   | `Polly`  | &nbsp;                                                                    |

**Example**

```js
new Polly('<Recording Name>', {
  /* ... */
});
```

## Events

### create

Emitted when a Polly instance gets created.

!> This is a synchronous event.

**Example**

```js
const listener = polly => {
  /* Do Something */
};

Polly.on('create', listener);
Polly.off('create', listener);
Polly.once('create', polly => {
  /* Do Something Once */
});
```

### stop

Emitted when a Polly instance has successfully stopped.

**Example**

```js
const listener = polly => {
  /* Do Something */
};

Polly.on('stop', listener);
Polly.off('stop', listener);
Polly.once('stop', polly => {
  /* Do Something Once */
});
```

## Properties

### recordingName

_Type_: `String`
_Default_: `null`

The recording name the recordings will be stored under. The provided name is
sanitized as well as postfixed with a GUID.

**Example**

```js
new Polly('Wants a Cracker', {
  /* ... */
});
```

Will save recordings to the following file:

```text
recordings
  └── Wants-a-Cracker_1234
      └── recording.json
```

**Example**

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

**Example**

```js
const polly = new Polly();

polly.mode; // → 'replay'
polly.record();
polly.mode; // → 'record'
```

### persister

_Type_: `Persister`
_Default_: `null`

The persister used to find and save recordings.

### server

_Type_: `Server`
_Default_: `Server`

Every polly instance has a reference to a [client-side server](server/overview) which you can leverage
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

| Param  | Type     | Description                           |
| ------ | -------- | ------------------------------------- |
| config | `Object` | [Configuration](configuration) object |

**Example**

```js
polly.configure({ recordIfMissing: false });
```

### record

Puts polly in recording mode. All requests going forward will
be sent to the server and their responses will be recorded.

**Example**

```js
polly.record();
```

### replay

Puts polly in replay mode. All requests going forward will be
played back from a saved recording.

**Example**

```js
polly.replay();
```

### passthrough

Puts polly in pass-through mode. All requests going forward will pass-through
directly to the server without being recorded or replayed.

**Example**

```js
polly.passthrough();
```

### pause

Disconnects the polly instance from all connected adapters. This ensures that
no requests will be handled by the polly instance until calling [play](api#play)
or manually connecting to a new adapter via [connectTo](api#connectTo). The
previously connected adapters will be saved and can be restored by
calling [play](api#play).

?> If using the [Puppeteer Adapter](adapters/puppeteer), you'll need to also
disable request interception via `await page.setRequestInterception(false)`.

**Example**

```js
await fetch('/api/not-a-secret');
polly.pause();
// This and all subsequent requests will no longer be handled by polly
await fetch('/api/secret');
```

### play

Reconnects to the adapters that were disconnected when [pause](api#pause)
was called.

?> If using the [Puppeteer Adapter](adapters/puppeteer), you'll need to also
enable request interception via `await page.setRequestInterception(true)`.

**Example**

```js
await fetch('/api/not-a-secret');
polly.pause();
// This and all subsequent requests will no longer be handled by polly
await fetch('/api/secret');
polly.play();
// This and all subsequent requests will again be handled by polly
await fetch('/api/not-a-secret');
```

### stop

Persist all recordings and disconnect from all adapters.

!> This method is `async` and will resolve once all recordings have
persisted and the instance has successfully torn down.

| Param   | Type      | Description |
| ------- | --------- | ----------- |
| Returns | `Promise` | &nbsp;      |

**Example**

```js
await polly.stop();
```

### connectTo

Connect to an adapter.

| Param | Type              | Description                             |
| ----- | ----------------- | --------------------------------------- |
| name  | `String|Function` | The adapter name of class to connect to |

**Example**

```js
polly.connectTo('xhr');
polly.connectTo(XHRAdapter);
```

### disconnectFrom

Disconnect from an adapter.

| Param | Type              | Description                                  |
| ----- | ----------------- | -------------------------------------------- |
| name  | `String|Function` | The adapter name of class to disconnect from |

**Example**

```js
polly.disconnectFrom('xhr');
polly.disconnectFrom(XHRAdapter);
```

### disconnect

Disconnect from all connected adapters.

**Example**

```js
polly.disconnect();
```

### flush

Returns a Promise that resolves once all requests handled by Polly have resolved.

| Param   | Type      | Description |
| ------- | --------- | ----------- |
| Returns | `Promise` | &nbsp;      |

**Example**

```js
await polly.flush();
```
