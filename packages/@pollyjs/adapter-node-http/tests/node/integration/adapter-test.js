import '@pollyjs-tests/helpers/global-fetch';

import http from 'http';
import https from 'https';

import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import FSPersister from '@pollyjs/persister-fs';
import { setupMocha as setupPolly } from '@pollyjs/core';

import NodeHttpAdapter from '../../../src';
import binaryDownloadTest from '../../utils/binary-download-test';

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

  binaryDownloadTest(
    'should be able to fetch binary content with http',
    http,
    'http://via.placeholder.com/150/92c952'
  );

  binaryDownloadTest(
    'should be able to fetch binary content with https',
    https,
    'https://via.placeholder.com/150/92c952'
  );
});
