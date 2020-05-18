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

**Example**

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

**Example**

```js
polly.configure({
  recordIfMissing: true
});
```

## recordFailedRequests

_Type_: `Boolean`
_Default_: `false`

If `false`, Polly will throw when attempting to persist any failed requests.
A request is considered to be a failed request when its response's status code
is `< 200` or `≥ 300`.

**Example**

```js
polly.configure({
  recordFailedRequests: true
});
```

## flushRequestsOnStop

_Type_: `Boolean`
_Default_: `false`

Await any unresolved requests handled by the polly instance
(via [flush](api#flush)) when [stop](api#stop) is called.

**Example**

```js
polly.configure({
  flushRequestsOnStop: true
});
```

## expiresIn

_Type_: `String`
_Default_: `null`

After how long the recorded request will be considered expired from the time
it was persisted. A recorded request is considered expired if the recording's
`startedDateTime` plus the current `expiresIn` duration is in the past.

**Example**

```js
polly.configure({
  expiresIn: '30d5h10m' // expires in 30 days, 5 hours, and 10 minutes
});

polly.configure({
  expiresIn: '5 min 10 seconds 100 milliseconds' // expires in 5 minutes, 10 seconds, and 100 milliseconds
});
```

## expiryStrategy

_Type_: `String`
_Default_: `warn`

The strategy for what should occur when Polly tries to use an expired recording in `replay` mode. Can be one of the following:

- `warn`: Log a console warning about the expired recording.
- `error`: Throw an error.
- `record`: Re-record by making a new network request.

**Example**

```js
polly.configure({
  expiryStrategy: 'error'
});
```

## mode

_Type_: `String`
_Default_: `'replay'`

The Polly mode. Can be one of the following:

- `replay`: Replay responses from recordings.
- `record`: Force Polly to record all requests. This will overwrite recordings that already exist.
- `passthrough`: Passes all requests through directly to the server without recording or replaying.

**Example**

```js
polly.configure({
  mode: 'record'
});
```

## adapters

_Type_: `Array[String|Function]`
_Default_: `[]`

The adapter(s) polly will hook into.

**Example**

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

?> **NOTE:** Check out the appropriate documentation pages for each adapter
for more details.

**Example**

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

**Example**

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

?> **NOTE:** Check out the appropriate documentation pages for each persister
for more details.

**Example**

```js
polly.configure({
  persisterOptions: {
    rest: {
      apiNamespace: '/polly'
    }
  }
});
```

### keepUnusedRequests

_Type_: `Boolean`
_Default_: `false`

When disabled, requests that have not been captured by the running Polly
instance will be removed from any previous recording. This ensures that a
recording will only contain the requests that were made during the lifespan
of the Polly instance. When enabled, new requests will be appended to the
recording file.

**Example**

```js
polly.configure({
  persisterOptions: {
    keepUnusedRequests: true
  }
});
```

### disableSortingHarEntries

_Type_: `Boolean`
_Default_: `false`

When disabled, entries in the the final HAR will be sorted by the request's timestamp.
This is done by default to satisfy the HAR 1.2 spec but can be enabled to improve
diff readability when committing recordings to git.

**Example**

```js
polly.configure({
  persisterOptions: {
    disableSortingHarEntries: true
  }
});
```

## timing

_Type_: `Function`
_Default_: `Timing.fixed(0)`

The timeout delay strategy used when replaying requests.

**Example**

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

  _Type_: `Boolean | Function`
  _Default_: `true`

  The request method (e.g. `GET`, `POST`)

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      method: false
    }
  });

  polly.configure({
    matchRequestsBy: {
      method(method, req) {
        return method.toLowerCase();
      }
    }
  });
  ```

- ### headers

  _Type_: `Boolean | Function | Object`
  _Default_: `true`

  The request headers.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      headers: false
    }
  });

  polly.configure({
    matchRequestsBy: {
      headers(headers, req) {
        delete headers['X-AUTH-TOKEN'];
        return headers;
      }
    }
  });
  ```

  Specific headers can also be excluded with the following:

  **Example**

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

  _Type_: `Boolean | Function`
  _Default_: `true`

  The request body.

  !> Please make sure you do not modify the passed in body. If you need to make changes, create a copy of it first. The body function receives the actual request body — any modifications to it will result with it being sent out with the request.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      body: false
    }
  });

  polly.configure({
    matchRequestsBy: {
      body(body, req) {
        const json = JSON.parse(body);

        delete json.email;
        return JSON.stringify(json);
      }
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
  model = await fetch('/models/1').then(res => res.json());

  // Assert that our change persisted
  expect(model.foo).to.equal('bar');
  ```

  The order of the requests matter since the payload for the first and
  last fetch are different.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      order: false
    }
  });
  ```

- ### url

  _Type_: `Boolean | Function | Object`
  _Default_: `{ protocol: true, username: true, ... }`

  The request url.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: false
    }
  });

  polly.configure({
    matchRequestsBy: {
      url(url, req) {
        return url.replace('test', '');
      }
    }
  });

  polly.configure({
    matchRequestsBy: {
      url: {
        protocol(protocol) {
          return 'https:';
        },
        query: false
      }
    }
  });
  ```

- ### url.protocol

  _Type_: `Boolean | Function`
  _Default_: `true`

  The request url protocol (e.g. `http:`).

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        protocol: false
      }
    }
  });

  polly.configure({
    matchRequestsBy: {
      url: {
        protocol(protocol, req) {
          return 'https:';
        }
      }
    }
  });
  ```

- ### url.username

  _Type_: `Boolean | Function`
  _Default_: `true`

  Username of basic authentication.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        username: false
      }
    }
  });
  polly.configure({
    matchRequestsBy: {
      url: {
        username(username, req) {
          return 'username';
        }
      }
    }
  });
  ```

- ### url.password

  _Type_: `Boolean | Function`
  _Default_: `true`

  Password of basic authentication.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        password: false
      }
    }
    matchRequestsBy: {
      url: {
        password(password, req) {
          return 'password';
        }
      }
    }
  });
  ```

- ### url.hostname

  _Type_: `Boolean | Function`
  _Default_: `true`

  Host name without port number.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        hostname: false
      }
    }
  });

  polly.configure({
    matchRequestsBy: {
      url: {
        hostname(hostname, req) {
          return hostname.replace('.com', '.net');
        }
      }
    }
  });
  ```

- ### url.port

  _Type_: `Boolean | Function`
  _Default_: `true`

  Port number.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        port: false
      }
    }
  });

  polly.configure({
    matchRequestsBy: {
      url: {
        port(port, req) {
          return 3000;
        }
      }
    }
  });
  ```

- ### url.pathname

  _Type_: `Boolean | Function`
  _Default_: `true`

  URL path.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        pathname(pathname, req) {
          return pathname.replace('/api/v1', '/api');
        }
      }
    }
  });
  ```

- ### url.query

  _Type_: `Boolean | Function`
  _Default_: `true`

  Sorted query string.

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        query: false
      }
    }
  });

  polly.configure({
    matchRequestsBy: {
      url: {
        query(query, req) {
          return { ...query, token: '' };
        }
      }
    }
  });
  ```

- ### url.hash

  _Type_: `Boolean | Function`
  _Default_: `false`

  The "fragment" portion of the URL including the pound-sign (`#`).

  **Example**

  ```js
  polly.configure({
    matchRequestsBy: {
      url: {
        hash: true
      }
    }
  });

  polly.configure({
    matchRequestsBy: {
      url: {
        hash(hash, req) {
          return hash.replace(/token=[0-9]+/, '');
        }
      }
    }
  });
  ```
