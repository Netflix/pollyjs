import { setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import RESTPersister from '@pollyjs/persister-rest';
import xhrRequest from '@pollyjs-tests/helpers/xhr-request';
import XHRAdapter from '../../src';

describe('Integration | XHR Adapter', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [XHRAdapter],
    persister: RESTPersister,
    persisterOptions: {
      rest: { host: '' }
    }
  });

  setupFetchRecord({
    fetch() {
      return xhrRequest(...arguments);
    }
  });
  setupPolly.afterEach();

  adapterTests();
  adapterBrowserTests();
});
