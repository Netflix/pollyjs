import { Polly, Timing, setupQunit as setupPolly } from '@pollyjs/core';
import { module, test } from 'qunit';

module('Unit | Polly | General', function() {
  module('Polly', function() {
    test('it works', function(assert) {
      assert.equal(typeof Polly, 'function');
    });

    test('it defaults to an empty string for persisterOptions.rest.host', function(assert) {
      const polly = new Polly('abc');
      assert.equal(polly.config.persisterOptions.rest.host, '');

      return polly.stop();
    });
  });

  module('setupPolly', function(hooks) {
    setupPolly(hooks);

    test('it works', function(assert) {
      assert.ok(this.polly);
      assert.ok(this.polly instanceof Polly);
    });
  });

  module('setupPolly.[beforeEach,afterEach]', function(hooks) {
    setupPolly.beforeEach(hooks);
    setupPolly.afterEach(hooks);

    test('it works', function(assert) {
      assert.ok(this.polly);
      assert.ok(this.polly instanceof Polly);
    });
  });

  module('Timing', function() {
    test('it works', function(assert) {
      assert.equal(typeof Timing, 'object');
      assert.equal(typeof Timing.fixed, 'function');
      assert.equal(typeof Timing.relative, 'function');
    });
  });

  module('auto-registers', function() {
    test('adapters', async function(assert) {
      const polly = new Polly('adapters');
      assert.equal(polly.adapters.size, 2);
      await polly.stop();
    });

    test('persister', async function(assert) {
      const polly = new Polly('persister');
      assert.equal(typeof polly.persister, 'object');
      await polly.stop();
    });
  });
});
