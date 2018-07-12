# Quick Start

## Installation

?> Using Ember.JS? See the [Ember CLI Addon](frameworks/ember-cli) documentation for more details.

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/cli -g
npm install @pollyjs/core -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn global add @pollyjs/cli
yarn add @pollyjs/core -D
```

## Setup

In order to write to disk, Polly makes networks requests to a local server which
does all the heavy lifting. If you don't want to use the CLI and you have your
own express server, see the [Express Integrations](node-server/express-integrations)
documentation on integrating with your existing server.

Using the installed [CLI](cli/overview), run the [listen](cli/commands#listen)
command to start up the node server.

```bash
polly listen
```

Optionally, Polly can persist to local storage which would not require setting up
any node integrations. See the [Local Storage Persister](persisters/local-storage)
documentation for more details.

## How it Works

Once instantiated, Polly will hook into native browser APIs (such as fetch & XHR) via
adapters to intercept any outgoing requests. Depending on its current
[mode](configuration#mode) as well as rules defined via the
[client-side server](server/overview), the request will either be replayed, recorded,
passed-through, or intercepted.

## Usage

Now that you've installed Polly and have setup your server, you're ready to
fly. Lets take a look at what an example test case would look like using Polly.

```js
import { Polly, FetchAdapter, XHRAdapter, RESTPersister } from '@pollyjs/core';

/*
  Register the adapters and persisters we want to use. This way all future
  polly instances can access them by name.
*/
Polly.register(XHRAdapter)
Polly.register(FetchAdapter)
Polly.register(RESTPersister)

describe('Netflix Homepage', function() {
  it('should be able to sign in', async function() {
    /*
      Create a new polly instance.

      Connect Polly to both fetch and XHR browser APIs. By default, it will
      record any requests that it hasn't yet seen while replaying ones it
      has already recorded.
    */
    const polly = new Polly('Sign In', {
      adapters: ['xhr', 'fetch'],
      persister: 'rest'
    });
    const { server } = polly;

    /* Intercept all Google Analytic requests and respond with a 200 */
    server
      .get('/google-analytics/*path')
      .intercept((req, res) => res.sendStatus(200));

    /* Pass-through all GET requests to /coverage */
    server.get('/coverage').passthrough();

    /* start: pseudo test code */
    await visit('/login');
    await fillIn('email', 'polly@netflix.com');
    await fillIn('password', '@pollyjs');
    await submit();
    /* end: pseudo test code */

    expect(location.pathname).to.equal('/browse');

    /*
      Calling `stop` will persist requests as well as disconnect from any
      connected browser APIs (e.g. fetch or XHR).
    */
    await polly.stop();
  });
});
```

The above test case would generate the following recording HAR which Polly will
use to replay the sign-in request/response when the test is rerun:

```json
{
  "log": {
    "_recordingName": "Sign In",
    "browser": {
      "name": "Chrome",
      "version": "67.0"
    },
    "creator": {
      "name": "Polly.JS",
      "version": "0.5.0"
    },
    "entries": [
      {
        "_id": "06f06e6d125cbb80896c41786f9a696a",
        "_order": 0,
        "cache": {},
        "request": {
          "bodySize": 51,
          "cookies": [],
          "headers": [
            {
              "name": "content-type",
              "value": "application/json; charset=utf-8"
            }
          ],
          "headersSize": 97,
          "httpVersion": "HTTP/1.1",
          "method": "POST",
          "postData": {
            "mimeType": "application/json; charset=utf-8",
            "text": "{\"email\":\"polly@netflix.com\",\"password\":\"@pollyjs\"}"
          },
          "queryString": [],
          "url": "https://netflix.com/api/v1/login"
        },
        "response": {
          "bodySize": 0,
          "content": {
            "mimeType": "text/plain; charset=utf-8",
            "size": 0
          },
          "cookies": [],
          "headers": [],
          "headersSize": 0,
          "httpVersion": "HTTP/1.1",
          "redirectURL": "",
          "status": 200,
          "statusText": "OK"
        },
        "startedDateTime": "2018-06-29T17:31:55.348Z",
        "time": 11,
        "timings": {
          "blocked": -1,
          "connect": -1,
          "dns": -1,
          "receive": 0,
          "send": 0,
          "ssl": -1,
          "wait": 11
        }
      }
    ],
    "pages": [],
    "version": "1.2"
  }
}
```

## Client-Side Server

Every polly instance has a reference to a client-side server which you can leverage
to gain full control of all HTTP interactions as well as dictate how the Polly instance
should handle them.

?> _TIP:_ Check out the [Server](server/overview) documentation for more details and examples!

Lets take a look at how we can modify our previous test case to test against a
failed sign in attempt.

```js
import { Polly } from '@pollyjs/core';

describe('Netflix Homepage', function() {
  it('should handle a failed sign in attempt', async function() {
    const polly = new Polly('Failed Sign In', {
      adapters: ['xhr', 'fetch'],
      persister: 'rest'
    });
    const { server } = polly;

    /*
      Using the client-side server, we can intercept when a request url matches
      `/api/v1/login` and respond with the necessary status code and body to
      emulate a failed sign in attempt.
    */
    server.get('/api/v1/login').intercept((req, res) => {
      // Set the response's status code to be 401 (Unauthorized)
      res.status(401);

      // Respond with a json object containing an error message that will be shown
      res.json({
        error: {
          message: 'Incorrect username or password.'
        }
      });
    })

    /* start: pseudo test code */
    await visit('/login');
    await fillIn('email', 'polly@netflix.com');
    await fillIn('password', '@pollyjs');
    await submit();
    /* end: pseudo test code */

    expect(document.querySelector('.error-message').textContent)
      .to.equal('Incorrect username or password.');

    /*
      Calling `stop` will persist requests as well as disconnect from any
      connected browser APIs (e.g. fetch or XHR).
    */
    await polly.stop();
  });
});
```

## Test Helpers

Using Mocha or QUnit? We got you covered! Checkout the [Mocha](test-helpers/mocha) or
[QUnit](test-helpers/qunit) documentation pages for detailed instructions
on how to use the provided test helpers.
