# Mocha

The `@pollyjs/core` package provides a `setupMocha` utility which will setup
a new polly instance for each test as well as stop it once the test has ended.
The Polly instance's recording name is derived from the current test name as well as its
parent module(s).

| Param | Type | Description |
|  ---  | ---  |     ---     |
| config | `Object` | [Configuration](configuration) object |

## Usage

### Simple Example

```js
import { setupMocha as setupPolly } from '@pollyjs/core';

describe('Netflix Homepage', function() {
  setupPolly({/* default configuration options */});

  it('should be able to sign in', async function() {
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

    expect(location.pathname).to.equal('/browse');

    /*
      The setupPolly test helper will call `this.polly.stop()` when your test
      has finished.
    */
  });
});
```

### Intercept Example

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
