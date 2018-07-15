import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import persisterTests from '@pollyjs-tests/integration/persister-tests';
import LocalStoragePersister from '../../src';

describe('Integration | Local Storage Persister', function() {
  beforeEach(function() {
    this.fetch = (...args) => fetch(...args);
  });

  setupPolly.beforeEach({
    recordFailedRequests: true,
    persister: LocalStoragePersister
  });

  setupFetchRecord();
  setupPolly.afterEach();

  persisterTests();
});
