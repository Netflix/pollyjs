import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

import FormData from 'form-data';
import getStream from 'get-stream';
import adapterIdentifierTests from '@pollyjs-tests/integration/adapter-identifier-tests';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import { Polly, setupMocha as setupPolly } from '@pollyjs/core';

import NodeHTTPAdapter from '../../src';
import nativeRequest from '../utils/native-request';
import pollyConfig from '../utils/polly-config';
import getResponseFromRequest from '../utils/get-response-from-request';
import calculateHashFromStream from '../utils/calculate-hash-from-stream';

describe('Integration | Node Http Adapter', function() {
  describe('Concurrency', function() {
    it('should prevent concurrent Node HTTP adapter instances', async function() {
      const one = new Polly('one');
      const two = new Polly('two');

      one.connectTo(NodeHTTPAdapter);

      expect(function() {
        two.connectTo(NodeHTTPAdapter);
      }).to.throw(/Running concurrent node-http adapters is unsupported/);

      await one.stop();
      await two.stop();
    });

    it('should prevent running nock concurrently with the node-http adapter', async function() {
      const polly = new Polly('nock');
      const nock = require('nock');

      nock.activate();

      expect(function() {
        polly.connectTo(NodeHTTPAdapter);
      }).to.throw(
        /Running nock concurrently with the node-http adapter is unsupported/
      );

      nock.restore();
      await polly.stop();
    });
  });

  describe('http', function() {
    setupPolly.beforeEach(pollyConfig);

    setupFetchRecord({
      host: 'http://localhost:4000',
      fetch: nativeRequest.bind(undefined, http)
    });

    setupPolly.afterEach();

    adapterTests();
    adapterIdentifierTests();
    commonTests(http);
  });

  describe('https', function() {
    setupPolly(pollyConfig);
    commonTests(https);
  });
});

function commonTests(transport) {
  const { protocol } = transport.globalAgent;

  it('should be able to upload a binary data', async function() {
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
    expect(requests[0].body.toString('base64')).to.equal(
      body.toString('base64')
    );
    expect(requests[0].identifiers.body).to.equal(body.toString('hex'));
  });

  it('should be able to upload form data', async function() {
    const url = `${protocol}//example.com/upload`;
    const { server } = this.polly;
    const formData = new FormData();
    let request;

    server.post(url).intercept((req, res) => {
      request = req;
      res.send(201);
    });

    formData.append(
      'upload',
      fs.createReadStream(path.resolve(__dirname, '../../package.json'))
    );
    const body = await getStream(formData);

    await nativeRequest(transport, url, {
      body,
      headers: formData.getHeaders(),
      method: 'POST'
    });

    expect(request).to.exist;
    expect(typeof request.body).to.equal('string');
    expect(request.body).to.include('@pollyjs/adapter-node-http');
  });

  it('should be able to download binary content', async function() {
    const url = `${protocol}//via.placeholder.com/150/92c952`;
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

  it('should handle aborting a request', async function() {
    const { server } = this.polly;
    const url = `${protocol}//example.com`;
    const req = transport.request(url);
    let abortEventCalled = false;

    server
      .any(url)
      .on('request', () => req.abort())
      .on('abort', () => (abortEventCalled = true))
      .intercept((_, res) => {
        res.sendStatus(200);
      });

    try {
      await getResponseFromRequest(req);
    } catch (e) {
      // no-op
    }

    await this.polly.flush();
    expect(abortEventCalled).to.equal(true);
  });

  it('should handle immediately aborting a request', async function() {
    const { server } = this.polly;
    const url = `${protocol}//example.com`;
    const req = transport.request(url);
    let abortEventCalled = false;

    server
      .any(url)
      .on('abort', () => (abortEventCalled = true))
      .intercept((_, res) => {
        res.sendStatus(200);
      });

    const promise = getResponseFromRequest(req);

    req.abort();

    try {
      await promise;
    } catch (e) {
      // no-op
    }

    await this.polly.flush();
    expect(abortEventCalled).to.equal(true);
  });
}
