import { setupMocha as setupPolly } from '../../../src';
import setupFetch from '../helpers/setup-fetch';
import setupPersister from '@pollyjs-tests/helpers/setup-persister';
import persisterTests from '@pollyjs-tests/integration/persister-tests';
import Configs from './configs';

describe('Integration | Persisters', function() {
  for (const name in Configs) {
    const defaults = Configs[name];

    describe(name, function() {
      setupPolly.beforeEach(defaults);
      setupFetch();
      setupPersister();
      setupPolly.afterEach();

      persisterTests();
    });
  }
});
