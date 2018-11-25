import '@pollyjs-tests/helpers/global-fetch';

import http from 'http';
import https from 'https';
import crypto from 'crypto';

import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import FSPersister from '@pollyjs/persister-fs';
import { setupMocha as setupPolly } from '@pollyjs/core';

import NodeHttpAdapter from '../../../src';

const collectBuffer = stream => {
  return new Promise(resolve => {
    const chunks = [];

    stream.on('data', chunk => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};

const calculateHashFromStream = async stream => {
  const hmac = crypto.createHmac('sha256', 'a secret');
  const hashStream = stream.pipe(hmac);

  const hashBuffer = await collectBuffer(hashStream);

  return hashBuffer.toString('hex');
};

const createHttpResponseStream = req =>
  new Promise(resolve => {
    req.on('response', res => {
      resolve(res);
    });

    req.end();
  });

const binaryDownloadTest = (testTitle, transport, url) => {
  it(testTitle, async function() {
    const { server } = this.polly;

    server.get(url).passthrough(true);

    const nativeResponseStream = await createHttpResponseStream(
      transport.request(url)
    );

    server.get(url).passthrough(false);

    const recordedResponseStream = await createHttpResponseStream(
      transport.request(url)
    );

    const [nativeHash, recordedHash] = await Promise.all([
      calculateHashFromStream(nativeResponseStream),
      calculateHashFromStream(recordedResponseStream)
    ]);

    expect(nativeHash).to.equal(recordedHash);
  });
};

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
