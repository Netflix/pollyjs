import http from 'http';

import setupPersister from '@pollyjs-tests/helpers/setup-persister';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import persisterTests from '@pollyjs-tests/integration/persister-tests';
import { setupMocha as setupPolly } from '@pollyjs/core';

import nativeRequest from '../utils/native-request';
import pollyConfig from '../utils/polly-config';

describe('Integration | FS Persister', function() {
  setupPolly.beforeEach(pollyConfig);

  setupFetchRecord({
    host: 'http://localhost:4000',
    fetch: nativeRequest.bind(undefined, http)
  });
  setupPersister();
  setupPolly.afterEach();

  persisterTests();
});
