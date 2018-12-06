import '@pollyjs-tests/helpers/global-fetch';

import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import { setupMocha as setupPolly } from '@pollyjs/core';

import setupPollyConfig from '../utils/setup-polly-config';

describe('Integration | Node Http Adapter | node-fetch', function() {
  setupPolly.beforeEach(setupPollyConfig);

  setupFetchRecord({ host: 'http://localhost:4000' });
  setupPolly.afterEach();

  adapterTests();
});
