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

### Simple Example

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

### Intercept Example

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
