# Custom Adapter

If you need to create your own adapter or modify an pre-existing one, you've come
to the right page!

## Creating a Custom Adapter

The `@pollyjs/adapter` package provides an extendable base adapter class that
contains core logic dependent on by the [Fetch](adapters/fetch)
& [XHR](adapters/xhr) adapters.

### Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter -D
```

### Usage

```js
import Adapter from '@pollyjs/adapter';

class CustomAdapter extends Adapter {
  static get id() {
    return 'custom';
  }

  onConnect() {
    /* Do something when the adapter is connect to */
  }

  onDisconnect() {
    /* Do something when the adapter is disconnected from */
  }

  async passthroughRequest(pollyRequest) {
    /* Do something when the adapter is connect to */
  }

  /* optional */
  async respondToRequest(pollyRequest) {
    const { statusCode, body, headers } = pollyRequest.response;
    /* Deliver the response to the user */
  }
}
```

The `Adapter` class provides the `handleRequest()` method which can be
called from `onConnect`. It accepts request parameters and returns a
PollyRequest object with a `response` property.

The `passthroughRequest` method takes a PollyRequest object, makes a real HTTP
request and returns the response as a `{ statusCode, headers, body }` object,
where `body` is a string.

The `respondToRequest()` method makes sure that the response has been delivered
to the user. `pollyjs.flush()` will wait for all `respondToRequests()` calls to
finish. You can omit the implementation of this method if no asynchronous
delivery is required.

### Simple Fetch adapter example

The following is a simple example of implementing an adapter for `fetch`. For
full examples, please refer to the source code for the
[Fetch](https://github.com/Netflix/pollyjs/blob/master/packages/@pollyjs/adapter-fetch/src/index.js)
& [XHR](https://github.com/Netflix/pollyjs/blob/master/packages/%40pollyjs/adapter-xhr/src/index.js)
adapters.

```js
class FetchAdapter extends Adapter {
  static get id() {
    return 'fetch';
  }

  onConnect() {
    this.originalFetch = window.fetch;

    window.fetch = async (url, options = {}) => {
      const { response } = await this.handleRequest({
        url,
        method: options.method,
        headers: options.headers,
        body: options.body
      });

      return new Response(response.body, {
        status: response.statusCode,
        statusText: response.statusText,
        headers: response.headers
      });
    };
  }

  onDisconnect() {
    window.fetch = this.originalFetch;
  }

  async passthroughRequest(pollyRequest) {
    const response = await this.originalFetch([
      pollyRequest.url,
      {
        method: pollyRequest.method,
        headers: pollyRequest.headers,
        body: pollyRequest.body
      }
    ]);

    return {
      statusCode: response.status,
      headers: serializeHeaders(response.headers),
      body: await response.text()
    };
  }
}
```

## Extending from an Existing Adapter

The `@pollyjs/core` package exports the `XHRAdapter` and `FetchAdapter` classes,
allowing you to modify them as needed.

```js
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';

class CustomXHRAdapter extends XHRAdapter {}
class CustomFetchAdapter extends FetchAdapter {}
```

## Registering & Connecting to a Custom Adapter

You can register and connect to a custom adapter by passing an array to the `adapters`
config where the first element is the name of your adapter and the second is the
adapter class.

```js
// Register and connect to a custom adapter:
new Polly('Custom Adapter', {
  adapters: [MyCustomAdapterClass]
});

// Register and connect to a custom adapter via .configure():
const polly = new Polly('Custom Adapter');

polly.configure({
  adapters: [MyCustomAdapterClass]
});
```
