import '@pollyjs-tests/helpers/global-fetch';

import setupPersister from '@pollyjs-tests/helpers/setup-persister';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import persisterTests from '@pollyjs-tests/integration/persister-tests';
import { setupMocha as setupPolly } from '@pollyjs/core';

import pollyConfig from '../utils/polly-config';

describe.only('Integration | FS Persister | node-fetch', function() {
  setupPolly.beforeEach(pollyConfig);

  setupFetchRecord({ host: 'http://localhost:4000' });
  setupPersister();
  setupPolly.afterEach();

  persisterTests();
});
