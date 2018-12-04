import http from 'http';
import https from 'https';

import semver from 'semver';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import { setupMocha as setupPolly } from '@pollyjs/core';

import nativeRequest from '../utils/native-request';
import setupPollyConfig from '../utils/setup-polly-config';
import getResponseFromRequest from '../utils/get-response-from-request';
import calculateHashFromStream from '../utils/calculate-hash-from-stream';

const NativeMethods = new Map([
  [http, { get: http.get, request: http.request }],
  [https, { get: https.get, request: https.request }]
]);

function testTransportPatching(transport) {
  it('should patch and unpatch', function() {
    const { get, request } = NativeMethods.get(transport);

    expect(transport.get).to.not.equal(get);
    expect(transport.request).to.not.equal(request);

    this.polly.disconnectFrom('node-http');

    expect(transport.get).to.equal(get);
    expect(transport.request).to.equal(request);
  });
}

function testBinaryDownload(transport) {
  const { protocol } = transport.globalAgent;
  const url = `${protocol}//via.placeholder.com/150/92c952`;

  it('should be able to download binary content', async function() {
    const { server } = this.polly;

    server.get(url).passthrough(true);

    const nativeResponseStream = await getResponseFromRequest(
      transport.request(url)
    );

    server.get(url).passthrough(false);

    const recordedResponseStream = await getResponseFromRequest(
      transport.request(url)
    );

    const [nativeHash, recordedHash] = await Promise.all([
      calculateHashFromStream(nativeResponseStream),
      calculateHashFromStream(recordedResponseStream)
    ]);

    expect(nativeHash).to.equal(recordedHash);
  });
}

function commonTests(transport) {
  const { protocol } = transport.globalAgent;

  it('should handle posting a buffer', async function() {
    const { server } = this.polly;
    const url = `${protocol}//example.com`;
    const body = Buffer.from('Node HTTP Adapter', 'base64');
    const requests = [];

    server.post(url).intercept((req, res) => {
      requests.push(req);
      res.sendStatus(204);
    });

    await nativeRequest(transport, url, { method: 'POST', body });
    await nativeRequest(transport, url, { method: 'POST', body });

    expect(requests).to.have.lengthOf(2);
    expect(requests[0].id).to.equal(requests[1].id);
    expect(requests[0].identifiers.body).to.equal(body.toString('hex'));
  });
}

describe('Integration | Node Http Adapter', function() {
  describe('http', function() {
    setupPolly.beforeEach(setupPollyConfig);

    setupFetchRecord({
      host: 'http://localhost:4000',
      fetch: nativeRequest.bind(undefined, http)
    });

    setupPolly.afterEach();

    adapterTests();
    testTransportPatching(http);
    testBinaryDownload(http);
    commonTests(http);
  });

  describe('https', function() {
    setupPolly(setupPollyConfig);

    if (semver.gte(process.version, '9.0.0')) {
      testTransportPatching(http);
    }

    testBinaryDownload(https);
    commonTests(https);
  });
});
