import '@pollyjs-tests/helpers/global-node-fetch';

import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterNodeTests from '@pollyjs-tests/integration/adapter-node-tests';
import { setupMocha as setupPolly } from '@pollyjs/core';

import pollyConfig from '../utils/polly-config';

describe('Integration | Node Http Adapter | node-fetch', function() {
  setupPolly.beforeEach(pollyConfig);

  setupFetchRecord({ host: 'http://localhost:4000' });
  setupPolly.afterEach();

  adapterTests();
  adapterNodeTests();
});
