# QUnit

The `@pollyjs/core` package provides a `setupQunit` utility which will setup
a new polly instance for each test as well as stop it once the test has ended.
The Polly instance's recording name is derived from the current test name as well as its
parent module(s).

| Param  | Type     | Description                           |
| ------ | -------- | ------------------------------------- |
| hooks  | `Object` | QUnit hooks object                    |
| config | `Object` | [Configuration](configuration) object |

## Usage

### Simple Example {docsify-ignore}

```js
import { setupQunit as setupPolly } from '@pollyjs/core';

module('Netflix Homepage', function(hooks) {
  setupPolly(hooks, {
    /* default configuration options */
  });

  test('should be able to sign in', async function(assert) {
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

    assert.equal(location.pathname, '/browse');

    /*
      The setupPolly test helper will call `this.polly.stop()` when your test
      has finished.
    */
  });
});
```

### Intercept Example {docsify-ignore}

```js
import { setupQunit as setupPolly } from '@pollyjs/core';

module('module', function(hooks) {
  setupPolly(hooks);

  test('does a thing', function(assert) {
    const { server } = this.polly;

    server
      .get('/ping')
      .intercept((req, res) => res.sendStatus(200));

    assert.equal((await fetch('/ping').status, 200);
  });
});
```

## Test Hook Ordering

Accessing `this.polly` during a test run after the polly instance has been
stopped and destroyed produces the following error:

!> _You are trying to access an instance of Polly that is no longer available._

If you need to do some work before the polly instance gets destroyed or just need more control on when each of the test hooks are called, `setupQunit` can be invoked as a function or accessed as an object with two methods: `setupQunit.beforeEach` and `setupQunit.afterEach`.

Instead of calling `setupQunit()`, register these two hooks separately in the order that fits within your test.

```js
import { setupQunit as setupPolly } from '@pollyjs/core';

module('Netflix Homepage', function(hooks) {
  setupPolly.beforeEach(hooks, {
    /* default configuration options */
  });

  hooks.afterEach(function() {
    /* do something before the polly instance is destroyed... */
  });

  setupPolly.afterEach(hooks);

  test('should be able to sign in', async function() {
    /* ... */
  });
});
```
