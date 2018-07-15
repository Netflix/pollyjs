import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import setupPersister from '@pollyjs-tests/helpers/setup-persister';
import persisterTests from '@pollyjs-tests/integration/persister-tests';
import FetchAdapter from '@pollyjs/adapter-fetch';
import LocalStoragePersister from '../../src';

describe('Integration | Local Storage Persister', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [FetchAdapter],
    persister: LocalStoragePersister
  });

  setupFetchRecord();
  setupPersister();
  setupPolly.afterEach();

  persisterTests();
});
