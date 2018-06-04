# Configuration

<!-- [config.js](https://raw.githubusercontent.com/Netflix/pollyjs/master/packages/%40pollyjs/core/src/defaults/config.js ':include :type=code') → -->

A Polly can be configured by passing a configuration object as the 2nd argument

```js
new Polly('<Recording>', {
  recordIfMissing: true
});
```

Or via the [configure](api#configure) method on the instance.

```js
const polly = new Polly('<Recording>');

polly.configure({
  recordIfMissing: true
});
```

## logging

_Type_: `Boolean`
_Default_: `false`

Logs requests by recording to the console.

__Example__

```js
polly.configure({
  logging: true
});
```

## recordIfMissing

_Type_: `Boolean`
_Default_: `true`

If a request's recording is not found, passthrough to the server and record the response.

__Example__

```js
polly.configure({
  recordIfMissing: true
});
```

## recordIfExpired

_Type_: `Boolean`
_Default_: `false`

If a request's recording has expired, passthrough to the server and record a new response.

__Example__

```js
polly.configure({
  recordIfExpired: true
});
```

## recordFailedRequests

_Type_: `Boolean`
_Default_: `false`

By default, Polly does not persist if there were requests that failed during recording.  A failed request is defined when it's response statusCode is < 200 or >= 300.

__Example__

```js
polly.configure({
  recordFailedRequests: true
});
```

## expiresIn

_Type_: `String`
_Default_: `null`

After how long the request's recording will be considered expired.

__Example__

```js
polly.configure({
  expiresIn: '30d5h10m' // expires in 30 days, 5 hours, 10 minutes
});
```

## mode

_Type_: `String`
_Default_: `'replay'`

The polly mode. Can be one of the following:

- `replay`: Replay
- `record`: Force record
- `passthrough`: Pass through directly to the server

__Example__

```js
polly.configure({
  mode: 'record'
});
```

## adapters

_Type_: `Array`
_Default_: `['fetch', 'xhr']`

The adapter(s) the polly will hook into.

__Example__

```js
polly.configure({
  adapters: ['xhr']
});
```

## persister

_Type_: `String`
_Default_: `'rest'`

The persister to use for recording and replaying requests.

__Example__

```js
polly.configure({
  persister: 'local-storage'
});
```

## persisterOptions

_Type_: `Object`

_Default_:

```js
{
  host: '',
  apiNamespace: '/polly'
}
```

Options to be passed into the persister.

?> __Note:__ Check out the appropriate documentation pages for each per
persister for more details.

__Example__

```js
polly.configure({
  persisterOptions: {}
});
```

## timing

_Type_: `Function`
_Default_: `Timing.fixed(0)`

The timing used when replaying requests.

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

__Example__

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

Request matching configuration

- ### method

  _Type_: `Boolean`
  _Default_: `true`

  The request's method (e.g. `GET`, `POST`)

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

  The request's headers.

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

  The request's body.

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

  __Example__

  ```js
  model.load();       // → fetch('/model/1')
  model.foo = 'bar';
  model.save();       // → fetch('/model/1', { method: 'POST' })
  model.reload();     // → fetch('/model/1')
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

  The protocol scheme of the URL (e.g. `http:`).

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
