# Configuration

A Polly instance can be configured by passing a configuration object
to the constructor's 2nd argument:

```js
new Polly('<Recording Name>', {
  recordIfMissing: false
});
```

Or via the [configure](api#configure) method on the instance:

```js
const polly = new Polly('<Recording Name>');

polly.configure({
  recordIfMissing: false
});
```

## Defaults

[config.js](https://raw.githubusercontent.com/Netflix/pollyjs/master/packages/@pollyjs/core/src/defaults/config.js ':include :type=code')

## logging

_Type_: `Boolean`
_Default_: `false`

Logs requests and their responses to the console grouped by the recording name.

__Example__

```js
polly.configure({
  logging: true
});
```

## recordIfMissing

_Type_: `Boolean`
_Default_: `true`

If a request's recording is not found, pass-through to the server and
record the response.

__Example__

```js
polly.configure({
  recordIfMissing: true
});
```

## recordIfExpired

_Type_: `Boolean`
_Default_: `false`

If a request's recording has expired, pass-through to the server and
record a new response.

__Example__

```js
polly.configure({
  recordIfExpired: true
});
```

## recordFailedRequests

_Type_: `Boolean`
_Default_: `false`

If `false`, Polly will throw when attempting to persist any failed requests.
A request is considered to be a failed request when its response's status code
is `< 200` or `≥ 300`.

__Example__

```js
polly.configure({
  recordFailedRequests: true
});
```

## expiresIn

_Type_: `String`
_Default_: `null`

After how long the recorded request will be considered expired from the time
it was persisted.

__Example__

```js
polly.configure({
  expiresIn: '30d5h10m' // expires in 30 days, 5 hours, and 10 minutes
});

polly.configure({
  expiresIn: '5 min 10 seconds 100 milliseconds' // expires in 5 minutes, 10 seconds, and 100 milliseconds
});
```

## mode

_Type_: `String`
_Default_: `'replay'`

The Polly mode. Can be one of the following:

- `replay`: Replay responses from recordings.
- `record`: Force Polly to record all requests. This will overwrite recordings that already exist.
- `passthrough`: Passes all requests through directly to the server without recording or replaying.

__Example__

```js
polly.configure({
  mode: 'record'
});
```

## adapters

_Type_: `Array[String|Function]`
_Default_: `[]`

The adapter(s) polly will hook into.

__Example__

```js
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';

// Register the xhr adapter so its accessible by all future polly instances
Polly.register(XHRAdapter);

polly.configure({
  adapters: ['xhr', FetchAdapter]
});
```

## adapterOptions

_Type_: `Object`
_Default_: `{}`

Options to be passed into the adapters keyed by the adapter name.

?> __NOTE:__ Check out the appropriate documentation pages for each adapter
for more details.

__Example__

```js
polly.configure({
  adapterOptions: {
    fetch: {
      context: win
    }
  }
});
```

## persister

_Type_: `String|Function`
_Default_: `null`

The persister to use for recording and replaying requests.

__Example__

```js
import RESTPersister from '@pollyjs/persister-rest';
import LocalStoragePersister from '@pollyjs/persister-local-storage';

// Register the local-storage persister so its accessible by all future polly instances
Polly.register(LocalStoragePersister);

polly.configure({
  persister: 'local-storage'
});

polly.configure({
  persister: RESTPersister
});
```

## persisterOptions

_Type_: `Object`
_Default_: `{}`

Options to be passed into the persister keyed by the persister name.

?> __NOTE:__ Check out the appropriate documentation pages for each persister
for more details.

__Example__

```js
polly.configure({
  persisterOptions: {
    rest: {
      apiNamespace: '/pollyjs'
    }
  }
});
```

### keepUnusedRequests

_Type_: `Boolean`
_Default_: `false`

When disabled, requests that have not been captured by the running Polly
instance will be removed. This ensures that a recording will only contain the
requests that were made during the lifespan of the Polly instance.
When enabled, new requests will be appended to the recording file.

__Example__

```js
polly.configure({
  persisterOptions: {
    keepUnusedRequests: true
  }
});
```

## timing

_Type_: `Function`
_Default_: `Timing.fixed(0)`

The timeout delay strategy used when replaying requests.

__Example__

```js
import { Timing } from '@pollyjs/core';

polly.configure({
  // Replay requests at 300% the original speed to simulate a 3g connection
  timing: Timing.relative(3.0)
});

polly.configure({
  // Replay requests with a 200ms delay
  timing: Timing.fixed(200)
});
```

## matchRequestsBy

_Type_: `Object`

_Default_:

```js
matchRequestsBy: {
  method: true,
  headers: true,
  body: true,
  order: true,

  url: {
    protocol: true,
    username: true,
    password: true,
    hostname: true,
    port: true,
    pathname: true,
    query: true,
    hash: false
  }
}
```

Request matching configuration. Each of these options are used to generate
a GUID for the request.

- ### method

  _Type_: `Boolean`
  _Default_: `true`

  The request method (e.g. `GET`, `POST`)

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      method: false
    }
  });
  ```

- ### headers

  _Type_: `Boolean | Object`
  _Default_: `true`

  The request headers.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      headers: false
    }
  });
  ```

  Specific headers can also be excluded:

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      headers: {
        exclude: ['X-AUTH-TOKEN']
      }
    }
  });
  ```

- ### body

  _Type_: `Boolean`
  _Default_: `true`

  The request body.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      body: false
    }
  });
  ```

- ### order

  _Type_: `Boolean`
  _Default_: `true`

  The order the request came in. Take the following scenario:

  ```js
  // Retrieve our model
  let model = await fetch('/models/1').then(res => res.json());

  // Modify the model
  model.foo = 'bar';

  // Save the model with our new change
  await fetch('/models/1', { method: 'POST', body: JSON.stringify(model) });

  // Get our updated model
  model = await fetch('/models/1').then(res => res.json())

  // Assert that our change persisted
  expect(model.foo).to.equal('bar');
  ```

  The order of the requests matter since the payload for the first and
  last fetch are different.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      order: false
    }
  });
  ```

- ### url.protocol

  _Type_: `Boolean`
  _Default_: `true`

  The request url protocol (e.g. `http:`).

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        protocol: false
      }
    }
  });
  ```

- ### url.username

  _Type_: `Boolean`
  _Default_: `true`

  Username of basic authentication.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        username: false
      }
    }
  });
  ```

- ### url.password

  _Type_: `Boolean`
  _Default_: `true`

  Password of basic authentication.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        password: false
      }
    }
  });
  ```

- ### url.hostname

  _Type_: `Boolean`
  _Default_: `true`

  Host name with port number.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        hostname: false
      }
    }
  });
  ```

- ### url.port

  _Type_: `Boolean`
  _Default_: `true`

  Port number.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        port: false
      }
    }
  });
  ```

- ### url.pathname

  _Type_: `Boolean`
  _Default_: `true`

  URL path.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        pathname: false
      }
    }
  });
  ```

- ### url.query

  _Type_: `Boolean`
  _Default_: `true`

  Sorted query string.

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        query: false
      }
    }
  });
  ```

- ### url.hash

  _Type_: `Boolean`
  _Default_: `false`

  The "fragment" portion of the URL including the pound-sign (`#`).

  __Example__

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        hash: true
      }
    }
  });
  ```
