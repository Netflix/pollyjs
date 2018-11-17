import '@pollyjs-tests/helpers/global-fetch';

import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import FSPersister from '@pollyjs/persister-fs';
import { setupMocha as setupPolly } from '@pollyjs/core';

import NodeHttpAdapter from '../../../src';

describe('Integration | Node Http Adapter | Node', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [NodeHttpAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: { recordingsDir: 'tests/recordings' }
    }
  });

  setupFetchRecord({ host: 'http://localhost:4000' });
  setupPolly.afterEach();

  adapterTests();
});
