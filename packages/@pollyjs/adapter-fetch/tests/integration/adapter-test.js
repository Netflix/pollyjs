import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import LocalStoragePersister from '@pollyjs/persister-local-storage';

describe('Integration | Fetch Adapter', function() {
  beforeEach(function() {
    this.fetch = (...args) => fetch(...args);
  });

  setupPolly.beforeEach({
    recordFailedRequests: true,
    persister: LocalStoragePersister
  });

  setupFetchRecord();
  setupPolly.afterEach();

  adapterTests();
  adapterBrowserTests();
});
