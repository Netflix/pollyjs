import http from 'http';
import https from 'https';

import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import { setupMocha as setupPolly } from '@pollyjs/core';

import nativeRequest from '../utils/native-request';
import setupPollyConfig from '../utils/setup-polly-config';
import testBinaryDownload from '../utils/test-binary-download';

describe('Integration | Node Http Adapter', function() {
  describe('http', function() {
    setupPolly.beforeEach(setupPollyConfig);

    setupFetchRecord({
      host: 'http://localhost:4000',
      fetch: nativeRequest.bind(undefined, http)
    });

    setupPolly.afterEach();

    adapterTests();
    testBinaryDownload(http);
  });

  describe('https', function() {
    setupPolly(setupPollyConfig);

    testBinaryDownload(https);
  });
});
