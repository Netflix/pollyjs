import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import setupPersister from '@pollyjs-tests/helpers/setup-persister';
import persisterTests from '@pollyjs-tests/integration/persister-tests';

import pollyConfig from '../utils/polly-config';

describe('Integration | REST Persister', function() {
  setupPolly.beforeEach(pollyConfig);

  setupFetchRecord();
  setupPersister();
  setupPolly.afterEach();

  persisterTests();
});
