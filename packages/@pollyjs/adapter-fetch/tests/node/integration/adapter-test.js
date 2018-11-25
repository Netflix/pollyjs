import '@pollyjs-tests/helpers/global-fetch';

import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterNodeTests from '@pollyjs-tests/integration/adapter-node-tests';
import FSPersister from '@pollyjs/persister-fs';
import { setupMocha as setupPolly } from '@pollyjs/core';

import FetchAdapter from '../../../src';
import commonTests from '../../common-tests';

describe('Integration | Fetch Adapter | Node', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [FetchAdapter],
    persister: FSPersister,
    persisterOptions: {
      fs: { recordingsDir: 'tests/recordings' }
    }
  });

  setupFetchRecord({ host: 'http://localhost:4000' });
  setupPolly.afterEach();

  adapterTests();
  adapterNodeTests();
  commonTests();
});
