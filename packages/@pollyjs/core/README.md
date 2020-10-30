<p align="center">
  <img alt="Polly.JS" width="400px" src="https://netflix.github.io/pollyjs/assets/images/wordmark-logo-alt.png" />
</p>
<h2 align="center">Record, Replay, and Stub HTTP Interactions</h2>

[![Build Status](https://travis-ci.com/Netflix/pollyjs.svg?branch=master)](https://travis-ci.com/Netflix/pollyjs)
[![npm version](https://badge.fury.io/js/%40pollyjs%2Fcore.svg)](https://badge.fury.io/js/%40pollyjs%2Fcore)
[![license](https://img.shields.io/github/license/Netflix/pollyjs.svg)](http://www.apache.org/licenses/LICENSE-2.0)

Polly.JS is a standalone, framework-agnostic JavaScript library that enables recording, replaying, and stubbing of HTTP interactions. By tapping into multiple request APIs across both Node & the browser, Polly.JS is able to mock requests and responses with little to no configuration while giving you the ability to take full control of each request with a simple, powerful, and intuitive API.

> Interested in contributing or just seeing Polly in action? Head over to [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to spin up the project!

## Why Polly?

Keeping fixtures and factories in parity with your APIs can be a time consuming process.
Polly alleviates this process by recording and maintaining actual server responses while also staying flexible.

- Record your test suite's HTTP interactions and replay them during future test runs for fast, deterministic, accurate tests.
- Use Polly's client-side server to modify or intercept requests and responses to simulate different application states (e.g. loading, error, etc.).

## Features

- 🚀 Node & Browser Support
- ⚡️️ Simple, Powerful, & Intuitive API
- 💎 First Class Mocha & QUnit Test Helpers
- 🔥 Intercept, Pass-Through, and Attach Events
- 📼 Record to Disk or Local Storage
- ⏱ Slow Down or Speed Up Time

## Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/core -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/core -D
```

## Getting Started

Check out the [Quick Start](https://netflix.github.io/pollyjs/#/quick-start) documentation to get started.

## Usage

Let's take a look at what an example test case would look like using Polly.

```js
import { Polly } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';
import RESTPersister from '@pollyjs/persister-rest';

/*
  Register the adapters and persisters we want to use. This way all future
  polly instances can access them by name/id.
*/
Polly.register(XHRAdapter);
Polly.register(FetchAdapter);
Polly.register(RESTPersister);

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

The above test case would generate the following [HAR](http://www.softwareishard.com/blog/har-12-spec/)
file which Polly will use to replay the sign-in response when the test is rerun:

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
      "version": "0.5.0",
      "comment": "persister:rest"
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

## Credits

_In alphabetical order:_

- [Jason Mitchell](https://twitter.com/_jasonmit) - Creator / Maintainer
- [Offir Golan](https://twitter.com/offirgolan) - Creator / Maintainer
- [Sophinie Som](https://twitter.com/s0phinie) - Branding / Logo

## We're hiring!

Join the Netflix Studio & Content Engineering teams to help us build projects like this!

Open Roles:

- [Senior UI Engineer - Production Visibility Engineering](https://jobs.netflix.com/jobs/868295)
- [Senior UI Engineer - Production Workflows Engineering](https://jobs.netflix.com/jobs/868224)

## License

Copyright (c) 2018 Netflix, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
