# Fetch Adapter

The fetch adapter wraps the global fetch method for seamless
recording and replaying of requests.

## Usage

Use the [configure](api#configure), [connectTo](api#connectto), and
[disconnectFrom](api#disconnectfrom) APIs to connect or disconnect from the
adapter.

```js
import { Polly, FetchAdapter } from '@pollyjs/core';

// Register the fetch adapter so its accessible by all future polly instances
Polly.register(FetchAdapter);

const polly = new Polly('<Recording Name>', {
  adapters: ['fetch']
});

// Disconnect using the `configure` API
polly.configure({ adapters: [] });

// Reconnect using the `connectTo` API
polly.connectTo('fetch');

// Disconnect using the `disconnectFrom` API
polly.disconnectFrom('fetch');
```
