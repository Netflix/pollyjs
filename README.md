# Polly.JS

[![Build Status](https://travis-ci.com/Netflix/pollyjs.svg?token=Z18soQhopzoWV2byxvwx&branch=master)](https://travis-ci.com/Netflix/pollyjs)

Standalone, framework agnostic, JavaScript library that enables recording, replaying, and stubbing HTTP interactions.

## Installation

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
own express server, see the [Node Server](docs/node-server/overview) documentation on
integrating with your existing server.

Using the installed CLI, run the `listen` command to start up the node server.

```bash
polly listen
```

Optionally, Polly can persist to local storage which would not require setting up
any node integrations. See the [Local Storage Persister](docs/persisters/local-storage)
documentation for more details.

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
    const { server } = polly;

    /* Intercept all Google Analytic requests and respond with a 200 */
    server
      .get('/google-analytics/*path')
      .intercept((req, res) => res.sendStatus(200));

    /* Pass-through all GET requests to /coverage */
    server.get('/coverage').passthrough();

    /* start: pseudo test code */
    await visit('/login');
    await fillIn('email', 'johndoe@email.com');
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

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
