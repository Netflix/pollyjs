# Quick Start

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/core -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/core -D
```

## How it Works

Once instantiated, Polly will hook into native implementations (such as fetch & XHR)
via adapters to intercept any outgoing requests. Depending on its current
[mode](configuration#mode) as well as rules defined via the
[client-side server](server/overview), the request will either be replayed, recorded,
passed-through, or intercepted.

## Adapters & Persisters

Before you start using Polly, you'll need to install the necessary adapters and
persisters depending on your application/environment. Adapters provide
functionality that allows Polly to intercept requests via different sources
(e.g. XHR, fetch, Puppeteer) while Persisters provide the functionality to read & write
recorded data (e.g. fs, local-storage).

Check out the appropriate documentation pages for each adapter and persister
for more details such as installation, usage, and available options.

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/adapter-{name} -D
npm install @pollyjs/persister-{name} -D
```

If you want to install them with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/adapter-{name} -D
yarn add @pollyjs/persister-{name} -D
```

Once installed, you can register the adapters and persisters with Polly so
they can easily be referenced by name later.

```js
import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import XHRAdapter from '@pollyjs/adapter-xhr';
import LocalStoragePersister from '@pollyjs/persister-local-storage';

Polly.register(FetchAdapter);
Polly.register(XHRAdapter);
Polly.register(LocalStoragePersister);

new Polly('<Recording Name>', {
  adapters: ['fetch', 'xhr'],
  persister: 'local-storage'
});
```

## Using Polly in the Browser?

Polly fully supports native in-browser usage, but because browsers can't write
to disk in the same way as conventional applications considerations need to be
made for persisting recordings.

If permanent, long-term persistence is not required then you can simply use the
[Local Storage Persister](persisters/local-storage), which writes to
`window.localStorage`.

For conventional file system storage you will need to use the
[REST Persister](persisters/rest) which runs as a separate process listening for
PollyJS activity. The server can be run in 2 ways. Firstly via the provided
[CLI](cli/overview)'s [listen](cli/commands#listen) command:

```bash
npm install @pollyjs/cli -g
polly listen
```

However, secondly there is also a convenient
[Express Integration](node-server/express-integrations) that appends the REST
server's endpoints to an existing server such as
[Webpack's Dev Server](https://webpack.js.org/configuration/dev-server/).

## Usage

Now that you've installed and setup Polly, you're ready to fly. Lets take a
look at what a simple example test case would look like using Polly.

```js
import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import LocalStoragePersister from '@pollyjs/persister-local-storage';

/*
  Register the adapters and persisters we want to use. This way all future
  polly instances can access them by name.
*/
Polly.register(FetchAdapter);
Polly.register(LocalStoragePersister);

describe('Simple Example', function() {
  it('fetches a post', async function() {
    /*
      Create a new polly instance.

      Connect Polly to fetch. By default, it will record any requests that it
      hasn't yet seen while replaying ones it has already recorded.
    */
    const polly = new Polly('Simple Example', {
      adapters: ['fetch'], // Hook into `fetch`
      persister: 'local-storage', // Read/write to/from local-storage
      logging: true // Log requests to console
    });

    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1'
    );
    const post = await response.json();

    expect(response.status).to.equal(200);
    expect(post.id).to.equal(1);

    /*
      Calling `stop` will persist requests as well as disconnect from any
      connected adapters.
    */
    await polly.stop();
  });
});
```

<p data-height="500" data-theme-id="light" data-slug-hash="EdBZry" data-default-tab="js,result" data-user="offirgolan" data-pen-title="Polly.JS Simple Example" class="codepen">See the Pen <a href="https://codepen.io/offirgolan/pen/EdBZry/">Polly.JS Simple Example</a> on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

The first time the test runs, Polly will record the response for the
`fetch('https://jsonplaceholder.typicode.com/posts/1')` request that was made. You will
see the following in the console:

```text
Recorded ➞ GET https://jsonplaceholder.typicode.com/posts/1 200 • 48ms
```

Once the Polly instance is [stopped](api#stop-1), the persister will generate the
following [HAR](http://www.softwareishard.com/blog/har-12-spec/) file which will
be used to replay the response to that request when the test is rerun:

```json
{
  "Simple-Example_823972681": {
    "log": {
      "_recordingName": "Simple Example",
      "browser": {
        "name": "Chrome",
        "version": "70.0"
      },
      "creator": {
        "comment": "persister:local-storage",
        "name": "Polly.JS",
        "version": "1.2.0"
      },
      "entries": [
        {
          "_id": "ffbc4836d419fc265c3b85cbe1b7f22e",
          "_order": 0,
          "cache": {},
          "request": {
            "bodySize": 0,
            "cookies": [],
            "headers": [],
            "headersSize": 63,
            "httpVersion": "HTTP/1.1",
            "method": "GET",
            "queryString": [],
            "url": "https://jsonplaceholder.typicode.com/posts/1"
          },
          "response": {
            "bodySize": 292,
            "content": {
              "mimeType": "application/json; charset=utf-8",
              "size": 292,
              "text": "{\n  \"userId\": 1,\n  \"id\": 1,\n  \"title\": \"sunt aut facere repellat provident occaecati excepturi optio reprehenderit\",\n  \"body\": \"quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto\"\n}"
            },
            "cookies": [],
            "headers": [
              {
                "name": "cache-control",
                "value": "public, max-age=14400"
              },
              {
                "name": "content-type",
                "value": "application/json; charset=utf-8"
              },
              {
                "name": "expires",
                "value": "Tue, 30 Oct 2018 22:52:42 GMT"
              },
              {
                "name": "pragma",
                "value": "no-cache"
              }
            ],
            "headersSize": 145,
            "httpVersion": "HTTP/1.1",
            "redirectURL": "",
            "status": 200,
            "statusText": "OK"
          },
          "startedDateTime": "2018-10-30T18:52:42.566Z",
          "time": 18,
          "timings": {
            "blocked": -1,
            "connect": -1,
            "dns": -1,
            "receive": 0,
            "send": 0,
            "ssl": -1,
            "wait": 18
          }
        }
      ],
      "pages": [],
      "version": "1.2"
    }
  }
}
```

The next time the test is run, Polly will use the recorded response instead
of going out to the server to get a new one. You will see the following in the
console:

```text
Replayed ➞ GET https://jsonplaceholder.typicode.com/posts/1 200 • 1ms
```

## Client-Side Server

Every Polly instance has a reference to a [client-side server](server/overview)
which you can leverage to gain full control of all HTTP interactions as well as
dictate how the Polly instance should handle them.

Lets take a look at how we can modify our previous test case to test against a
post that does not exist.

```js
describe('Simple Client-Side Server Example', function() {
  it('fetches an unknown post', async function() {
    /*
      Create a new polly instance.

      Connect Polly to fetch. By default, it will record any requests that it
      hasn't yet seen while replaying ones it has already recorded.
    */
    const polly = new Polly('Simple Client-Side Server Example', {
      adapters: ['fetch'], // Hook into `fetch`
      persister: 'local-storage', // Read/write to/from local-storage
      logging: true // Log requests to console
    });
    const { server } = polly;

    /*
      Add a rule via the client-side server to intercept the
      `https://jsonplaceholder.typicode.com/posts/404` request and return
      an error.
    */
    server
      .get('https://jsonplaceholder.typicode.com/posts/404')
      .intercept((req, res) => {
        res.status(404).json({ error: 'Post not found.' });
      });

    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/404'
    );
    const post = await response.json();

    expect(response.status).to.equal(404);
    expect(post.error).to.equal('Post not found.');

    /*
      Calling `stop` will persist requests as well as disconnect from any
      connected adapters.
    */
    await polly.stop();
  });
});
```

<p data-height="600" data-theme-id="light" data-slug-hash="OBebwW" data-default-tab="js,result" data-user="offirgolan" data-pen-title="Polly.JS Simple Client-Side Server Example" class="codepen">See the Pen <a href="https://codepen.io/offirgolan/pen/OBebwW/">Polly.JS Simple Client-Side Server Example</a> on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

When the test executes, Polly will detect that we've set a custom intercept rule for
`https://jsonplaceholder.typicode.com/posts/404` and will deffer to the intercept handler
to handle the response for that request. You will see the following in the console:

```text
Intercepted ➞ GET https://jsonplaceholder.typicode.com/posts/404 404 • 1ms
```

## Test Helpers

Using Mocha or QUnit? We've got you covered! Checkout the [Mocha](test-frameworks/mocha) or
[QUnit](test-frameworks/qunit) documentation pages for detailed instructions
on how to use the provided test helpers.
