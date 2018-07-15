import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-xhr-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import LocalStoragePersister from '@pollyjs/persister-local-storage';
import xhrRequest from '@pollyjs-tests/helpers/xhr-request';

describe('Integration | XHR Adapter', function() {
  beforeEach(function() {
    this.fetch = (...args) => xhrRequest(...args);
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
