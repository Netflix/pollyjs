# Node HTTP Adapter

The node-http adapter provides a low level nodejs http request adapter that uses [nock](https://github.com/nock/nock) to patch the [http](https://nodejs.org/api/http.html) and [https](https://nodejs.org/api/https.html) modules in nodejs for seamless recording and replaying of requests.

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter-node-http -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter-node-http -D
```

## Usage

Use the [configure](api#configure), [connectTo](api#connectto), and
[disconnectFrom](api#disconnectfrom) APIs to connect or disconnect from the
adapter.

```js
import { Polly } from '@pollyjs/core';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';

// Register the node http adapter so its accessible by all future polly instances
Polly.register(NodeHttpAdapter);

const polly = new Polly('<Recording Name>', {
  adapters: ['node-http']
});

// Disconnect using the `configure` API
polly.configure({ adapters: [] });

// Reconnect using the `connectTo` API
polly.connectTo('node-http');

// Disconnect using the `disconnectFrom` API
polly.disconnectFrom('node-http');
```
