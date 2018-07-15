import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import persisterTests from '@pollyjs-tests/integration/persister-tests';
import RESTPersister from '../../src';

describe('Integration | REST Persister', function() {
  beforeEach(function() {
    this.fetch = (...args) => fetch(...args);
  });

  setupPolly.beforeEach({
    recordFailedRequests: true,
    persister: RESTPersister,
    persisterOptions: {
      rest: { host: '' }
    }
  });

  setupFetchRecord();
  setupPolly.afterEach();

  persisterTests();
});
