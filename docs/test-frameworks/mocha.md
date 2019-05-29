# Mocha

The `@pollyjs/core` package provides a `setupMocha` utility which will setup
a new polly instance for each test as well as stop it once the test has ended.
The Polly instance's recording name is derived from the current test name as well as its
parent module(s).

| Param  | Type     | Description                           |
| ------ | -------- | ------------------------------------- |
| config | `Object` | [Configuration](configuration) object |

## Usage

### Simple Example {docsify-ignore}

```js
import { setupMocha as setupPolly } from '@pollyjs/core';

describe('Netflix Homepage', function() {
  setupPolly({
    /* default configuration options */
  });

  it('should be able to sign in', async function() {
    /*
      The setupPolly test helper creates a new polly instance which you can
      access via `this.polly`. The recording name is generated based on the module
      and test names.
    */
    this.polly.configure({ recordIfMissing: false });

    /* start: pseudo test code */
    await visit('/login');
    await fillIn('email', 'polly@netflix.com');
    await fillIn('password', '@pollyjs');
    await submit();
    /* end: pseudo test code */

    expect(location.pathname).to.equal('/browse');

    /*
      The setupPolly test helper will call `this.polly.stop()` when your test
      has finished.
    */
  });
});
```

### Intercept Example {docsify-ignore}

```js
import { setupMocha as setupPolly } from '@pollyjs/core';

describe('module', function() {
  setupPolly();

  it('does a thing', function() {
    const { server } = this.polly;

    server
      .get('/ping')
      .intercept((req, res) => res.sendStatus(200));

    expect((await fetch('/ping').status).to.equal(200);
  });
});
```

## Test Hook Ordering

Accessing `this.polly` during a test run after the polly instance has been
stopped and destroyed produces the following error:

!> _You are trying to access an instance of Polly that is no longer available._

If you need to do some work before the polly instance gets destroyed or just need more control on when each of the test hooks are called, `setupMocha` can be invoked as a function or accessed as an object with two methods: `setupMocha.beforeEach` and `setupMocha.afterEach`.

Instead of calling `setupMocha()`, register these two hooks separately in the order that fits within your test.

```js
import { setupMocha as setupPolly } from '@pollyjs/core';

describe('Netflix Homepage', function() {
  setupPolly.beforeEach({
    /* default configuration options */
  });

  afterEach(function() {
    /* do something before the polly instance is destroyed... */
  });

  setupPolly.afterEach();

  it('should be able to sign in', async function() {
    /* ... */
  });
});
```

## Configuring ember-mocha

If you're using [`ember-mocha`](https://github.com/emberjs/ember-mocha) be sure to use their built-in
[hooks API](https://github.com/emberjs/ember-mocha#setup-tests).  Otherwise, Polly's mocha test helper will be unable to teardown Polly between tests.

An example of how to correctly setup Polly with `ember-mocha`:

```js
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupApplicationTest } from 'ember-mocha';
import { visit, currentURL } from '@ember/test-helpers';
import { setupMocha as setupPolly } from '@pollyjs/core';

describe('Acceptance | Home', function() {
  const hooks = setupApplicationTest();
  setupPolly(
    {
      /* optional config */
    },
    hooks
  );

  it('can visit /', async function() {
    await visit('/');
    expect(currentURL()).to.equal('/');
  });
});
```
