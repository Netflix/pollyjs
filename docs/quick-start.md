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

In order write to disk, Polly makes networks requests to a local server which
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
[client side server](server/overview), the request will either be replayed, recorded,
passed-through, or intercepted.

## Usage

Now that you've installed Polly and have setup your server, you're ready to
fly. Lets take a look at what an example test case would look like using Polly.

```js
import { Polly } from '@pollyjs/core';

describe('Netflix Homepage', function() {
  it('should be able to sign in', async function() {
    /*
      Create a new polly instance.

      By default, Polly will connect to both fetch and XHR browser APIs and
      will record any requests that it hasn't yet seen while replaying ones it
      has already recorded.
    */
    const polly = new Polly('Sign In');

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

The above test case would generate the following recording which Polly will use
to replay the sign in request/response when the test is reran:

```json
{
  "created_at": "2018-06-01T20:36:46.198Z",
  "entries": {
    "1077f062f8b12b51733933f86fb7ebc4": [
      {
        "created_at": "2018-06-01T20:36:46.198Z",
        "request": {
          "body": "{\"email\":\"polly@netflix.com\",\"password\":\"@pollyjs\"}",
          "headers": {
            "Content-Type": "application/json;charset=utf-8"
          },
          "method": "POST",
          "timestamp": "2018-06-01T20:36:46.070Z",
          "url": "/api/v1/login"
        },
        "response": {
          "body": "",
          "headers": {},
          "status": 200,
          "timestamp": "2018-06-01T20:36:46.119Z"
        }
      }
    ]
  },
  "name": "Sign In",
  "schema_version": 0.1
}
```

## Client Side Server

Every polly instance has a reference to a client side server which you can leverage
to gain full control of all HTTP interactions as well as dictate how the Polly instance
should handle them.

?> _TIP:_ Check out the [Server](server/overview) documentation for more details and examples!

Lets take a look at how we can modify our previous test case to test against a
failed sign in attempt.

```js
import { Polly } from '@pollyjs/core';

describe('Netflix Homepage', function() {
  it('should handle a failed sign in attempt', async function() {
    const polly = new Polly('Failed Sign In');
    const { server } = polly;

    /*
      Using the client side server, we can intercept when a request url matches
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

Using Mocha or QUnit? We got you covered! Checkout the [Mocha](testing-frameworks/mocha) or
[QUnit](testing-frameworks/qunit) documentation pages for detailed instructions
on how to use the provided test helpers.
