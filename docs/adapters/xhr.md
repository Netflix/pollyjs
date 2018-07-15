# XHR Adapter

The XHR adapter uses Sinon's [Nise](https://github.com/sinonjs/nise) library
to fake the global `XMLHttpRequest` object while wrapping the native one to allow
for seamless recording and replaying of requests.

## Usage

Use the [configure](api#configure), [connectTo](api#connectto), and
[disconnectFrom](api#disconnectfrom) APIs to connect or disconnect from the
adapter.

```js
import { Polly, XHRAdapter } from '@pollyjs/core';

// Register the xhr adapter so its accessible by all future polly instances
Polly.register(XHRAdapter);

const polly = new Polly('<Recording Name>', {
  adapters: ['xhr']
});

// Disconnect using the `configure` API
polly.configure({ adapters: [] });

// Reconnect using the `connectTo` API
polly.connectTo('xhr');

// Disconnect using the `disconnectFrom` API
polly.disconnectFrom('xhr');
```
