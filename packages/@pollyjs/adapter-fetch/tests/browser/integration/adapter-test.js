import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import RESTPersister from '@pollyjs/persister-rest';

import FetchAdapter from '../../../src';

describe('Integration | Fetch Adapter | Browser', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [FetchAdapter],
    persister: RESTPersister,
    persisterOptions: {
      rest: { host: '' }
    }
  });

  setupFetchRecord();
  setupPolly.afterEach();

  adapterTests();
  adapterBrowserTests();
});
