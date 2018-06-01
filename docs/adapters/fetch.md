# Fetch Adapter

The fetch adapter wraps the native window's fetch method for seamless
recording and replaying of requests.

## Usage

The fetch adapter is connected to by default but you can use the
[configure](api#configure), [connectTo](api#connectto), and
[disconnectFrom](api#disconnectfrom) APIs to connect or disconnect from the
adapter.

```js
const polly = new Polly('<Recording>', {
  adapters: ['fetch']
});

// Disconnect using the `configure` API
polly.configure({ adapters: [] });

// Reconnect using the `connectTo` API
polly.connectTo('fetch');

// Disconnect using the `disconnectFrom` API
polly.disconnectFrom('fetch');
```
