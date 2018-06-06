# QUnit

The `@pollyjs/core` package provides a `setupQunit` utility which will setup
a new polly instance for each test as well as stop it once the test has ended.
The Polly instance's recording name is derived from the current test name as well as its
parent module(s).

| Param | Type | Description |
|  ---  | ---  |     ---     |
| hooks | `Object` | QUnit hooks object |
| config | `Object` | [Configuration](configuration) object |

## Usage

### Simple Example {docsify-ignore}

```js
import { setupQunit as setupPolly } from '@pollyjs/core';

module('Netflix Homepage', function(hooks) {
  setupPolly(hooks, {/* default configuration options */});

  test('should be able to sign in', async function(assert) {
    /*
      The setupPolly test helper creates a new polly instance which you can
      access via `this.polly`. The recording name is generated based on the module
      and test names.
    */
   this.polly.configure({ recordIfMissing: false });

    /* start: pseudo test code */
    await visit('/login');
    await fillIn('email', 'johndoe@email.com');
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

If you find yourself getting the following error during a test run:

!> _You are trying to access an instance of Polly that is no longer available._

Then this is due to accessing `this.polly` after the instance has been stopped and destroyed.
Typically, this occurs within an `afterEach` hook or inadvertently within an `async` method or `Promise` that settled after your tests finished.
We'll walk you through fixing the former while the latter is usually a bug in your test code where you'll need to await some async task.

`setupQunit` can be invoked as a function or accessed as an object with two methods: `setupQunit.beforeEach` and `setupQunit.afterEach`.
Typically most will only need to know of `setupQunit()` however, in your case you'll need finer control of when these two hooks fire.
By default, Mocha registers these hooks as FIFO (first-in, first-out). Instead of calling `setupQunit()`, register these two hooks separately,
and in the order that fits within your test, as shown below.

```js
import { setupQunit as setupPolly } from '@pollyjs/core';

module('Netflix Homepage', function(hooks) {
  setupPolly.beforeEach(hooks, {/* default configuration options */});

  hooks.afterEach(function() {
    /* do something before the polly instance is destroyed... */
  });

  setupPolly.afterEach(hooks);

  test('should be able to sign in', async function() {
    /* ... */
  });
});

```
