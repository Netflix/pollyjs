import { Polly, Timing, setupQunit as setupPolly } from '@pollyjs/core';
import { module, test } from 'qunit';

module('Unit | Polly | General', function () {
  module('Polly', function () {
    test('it works', function (assert) {
      assert.strictEqual(typeof Polly, 'function');
    });

    test('it defaults to an empty string for persisterOptions.rest.host', function (assert) {
      const polly = new Polly('abc');
      assert.strictEqual(polly.config.persisterOptions.rest.host, '');

      return polly.stop();
    });
  });

  module('setupPolly', function (hooks) {
    setupPolly(hooks);

    test('it works', function (assert) {
      assert.ok(this.polly);
      assert.ok(this.polly instanceof Polly);
    });
  });

  module('setupPolly.[beforeEach,afterEach]', function (hooks) {
    // eslint-disable-next-line qunit/no-hooks-from-ancestor-modules
    setupPolly.beforeEach(hooks);
    // eslint-disable-next-line qunit/no-hooks-from-ancestor-modules
    setupPolly.afterEach(hooks);

    test('it works', function (assert) {
      assert.ok(this.polly);
      assert.ok(this.polly instanceof Polly);
    });
  });

  module('Timing', function () {
    test('it works', function (assert) {
      assert.strictEqual(typeof Timing, 'object');
      assert.strictEqual(typeof Timing.fixed, 'function');
      assert.strictEqual(typeof Timing.relative, 'function');
    });
  });

  module('auto-registers', function () {
    test('adapters', async function (assert) {
      const polly = new Polly('adapters');
      assert.strictEqual(polly.adapters.size, 2);
      await polly.stop();
    });

    test('persister', async function (assert) {
      const polly = new Polly('persister');
      assert.strictEqual(typeof polly.persister, 'object');
      await polly.stop();
    });
  });
});
