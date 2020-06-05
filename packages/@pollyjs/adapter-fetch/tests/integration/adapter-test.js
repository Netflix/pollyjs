import { Polly, setupMocha as setupPolly } from '@pollyjs/core';
import { URL } from '@pollyjs/utils';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterPollyTests from '@pollyjs-tests/integration/adapter-polly-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import adapterIdentifierTests from '@pollyjs-tests/integration/adapter-identifier-tests';
import { Buffer } from 'buffer/';

import FetchAdapter from '../../src';
import pollyConfig from '../utils/polly-config';

class MockRequest {}
class MockResponse {}
class MockHeaders {}

describe('Integration | Fetch Adapter', function() {
  setupPolly.beforeEach(pollyConfig);

  setupFetchRecord();
  setupPolly.afterEach();

  adapterTests();
  adapterPollyTests();
  adapterBrowserTests();
  adapterIdentifierTests();

  it('should support URL instances', async function() {
    const { server } = this.polly;

    server.any(this.recordUrl()).intercept((_, res) => res.sendStatus(200));

    const res = await this.fetch(new URL(this.recordUrl()));

    expect(res.status).to.equal(200);
  });

  it('should support array of key/value pair headers', async function() {
    const { server } = this.polly;
    let headers;

    server
      .any(this.recordUrl())
      .on('request', req => {
        headers = req.headers;
      })
      .intercept((_, res) => res.sendStatus(200));

    const res = await this.fetchRecord({
      headers: [['Content-Type', 'application/json']]
    });

    expect(res.status).to.equal(200);
    expect(headers).to.deep.equal({ 'content-type': 'application/json' });
  });

  it('should handle aborting a request', async function() {
    const { server } = this.polly;
    const controller = new AbortController();
    let abortEventCalled = false;
    let error;

    server
      .any(this.recordUrl())
      .on('request', () => controller.abort())
      .on('abort', () => (abortEventCalled = true))
      .intercept((_, res) => {
        res.sendStatus(200);
      });

    try {
      await this.fetchRecord({ signal: controller.signal });
    } catch (e) {
      error = e;
    }

    expect(abortEventCalled).to.equal(true);
    expect(error.message).to.contain('The user aborted a request.');
  });

  it('should handle immediately aborting a request', async function() {
    const { server } = this.polly;
    const controller = new AbortController();
    let abortEventCalled = false;
    let error;

    server
      .any(this.recordUrl())
      .on('abort', () => (abortEventCalled = true))
      .intercept((_, res) => {
        res.sendStatus(200);
      });

    try {
      const promise = this.fetchRecord({ signal: controller.signal });

      controller.abort();
      await promise;
    } catch (e) {
      error = e;
    }

    expect(abortEventCalled).to.equal(true);
    expect(error.message).to.contain('The user aborted a request.');
  });

  it('should be able to download binary content', async function() {
    const fetch = async () =>
      Buffer.from(
        await this.fetch('/assets/32x32.png').then(res => res.arrayBuffer())
      );

    this.polly.disconnectFrom(FetchAdapter);

    const nativeResponseBuffer = await fetch();

    this.polly.connectTo(FetchAdapter);

    const recordedResponseBuffer = await fetch();

    const { recordingName, config } = this.polly;

    await this.polly.stop();
    this.polly = new Polly(recordingName, config);
    this.polly.replay();

    const replayedResponseBuffer = await fetch();

    expect(nativeResponseBuffer.equals(recordedResponseBuffer)).to.equal(true);
    expect(recordedResponseBuffer.equals(replayedResponseBuffer)).to.equal(
      true
    );
    expect(nativeResponseBuffer.equals(replayedResponseBuffer)).to.equal(true);
  });

  it('should return status text', async function() {
    const { server } = this.polly;

    server.any(this.recordUrl()).intercept((_, res) => res.sendStatus(200));

    const res = await this.fetch(new Request(this.recordUrl()));

    expect(res.statusText).to.equal('OK');
  });

  describe('Request', function() {
    it('should support Request objects', async function() {
      const { server } = this.polly;

      server.any(this.recordUrl()).intercept((_, res) => res.sendStatus(200));

      const res = await this.fetch(new Request(this.recordUrl()));

      expect(res.status).to.equal(200);
    });

    it('should set bodyUsed to true if a body is present', async function() {
      const { server } = this.polly;
      const request = new Request('/', { method: 'POST', body: '{}' });

      server.any().intercept((_, res) => res.sendStatus(200));

      expect(request.bodyUsed).to.equal(false);
      await this.fetch(request);
      expect(request.bodyUsed).to.equal(true);
    });

    it('should not set bodyUsed to true if a body is not present', async function() {
      const { server } = this.polly;
      const request = new Request('/');

      server.any().intercept((_, res) => res.sendStatus(200));

      expect(request.bodyUsed).to.equal(false);
      await this.fetch(request);
      expect(request.bodyUsed).to.equal(false);
    });

    function testRequestOptions(createRequest, options) {
      return async function() {
        const { server } = this.polly;
        let receivedOptions;

        server.any().intercept((req, res) => {
          receivedOptions = req.requestArguments.options;
          res.sendStatus(200);
        });

        const res = await this.fetch(createRequest());

        expect(res.status).to.equal(200);
        expect(options).to.deep.equal(receivedOptions);
      };
    }

    it(
      'should handle no options',
      testRequestOptions(() => new Request('/'), {})
    );

    it(
      'should handle simple options',
      testRequestOptions(
        () =>
          new Request('/', { method: 'POST', body: '{}', cache: 'no-cache' }),
        { method: 'POST', body: '{}', cache: 'no-cache' }
      )
    );

    it(
      'should handle a cloned request',
      testRequestOptions(
        () => new Request('/', { method: 'POST', body: '{}' }).clone(),
        { method: 'POST', body: '{}' }
      )
    );

    it(
      'should handle a request instance',
      testRequestOptions(
        () => new Request(new Request('/', { method: 'POST', body: '{}' })),
        { method: 'POST', body: '{}' }
      )
    );

    it(
      'should handle a request instance with overrides',
      testRequestOptions(
        () =>
          new Request(new Request('/', { method: 'POST', body: '{}' }), {
            method: 'PATCH',
            headers: { foo: 'bar' }
          }),
        { method: 'PATCH', headers: { foo: 'bar' }, body: '{}' }
      )
    );
  });
});

describe('Integration | Fetch Adapter | Init', function() {
  describe('Context', function() {
    it(`should assign context's fetch as the native fetch and Request as the native Request`, async function() {
      const polly = new Polly('context', { adapters: [] });
      const fetch = () => {};
      const adapterOptions = {
        fetch: {
          context: {
            fetch,
            Request: MockRequest,
            Response: MockResponse,
            Headers: MockHeaders
          }
        }
      };

      polly.configure({ adapters: [FetchAdapter], adapterOptions });

      expect(polly.adapters.get('fetch').nativeFetch).to.equal(fetch);
      expect(polly.adapters.get('fetch').nativeFetch).to.not.equal(
        adapterOptions.fetch.context.fetch
      );

      expect(polly.adapters.get('fetch').NativeRequest).to.equal(MockRequest);
      expect(polly.adapters.get('fetch').NativeRequest).to.not.equal(
        adapterOptions.fetch.context.Request
      );

      expect(function() {
        polly.configure({
          adapterOptions: { fetch: { context: {} } }
        });
      }).to.throw(/fetch global not found/);

      await polly.stop();
    });

    it('should throw when context, fetch, Request, Response, and Headers are undefined', async function() {
      const polly = new Polly('context', { adapters: [] });

      polly.configure({
        adapters: [FetchAdapter]
      });

      expect(function() {
        polly.configure({
          adapterOptions: { fetch: { context: undefined } }
        });
      }).to.throw(/fetch global not found/);

      expect(function() {
        polly.configure({
          adapterOptions: {
            fetch: {
              context: {
                fetch: undefined,
                Request: MockRequest,
                Response: MockResponse,
                Headers: MockHeaders
              }
            }
          }
        });
      }).to.throw(/fetch global not found/);

      expect(function() {
        polly.configure({
          adapterOptions: {
            fetch: {
              context: {
                fetch() {},
                Request: undefined,
                Response: MockResponse,
                Headers: MockHeaders
              }
            }
          }
        });
      }).to.throw(/Request global not found/);

      expect(function() {
        polly.configure({
          adapterOptions: {
            fetch: {
              context: {
                fetch() {},
                Request: MockRequest,
                Response: undefined,
                Headers: MockHeaders
              }
            }
          }
        });
      }).to.throw(/Response global not found/);

      expect(function() {
        polly.configure({
          adapterOptions: {
            fetch: {
              context: {
                fetch() {},
                Request: MockRequest,
                Response: MockResponse,
                Headers: undefined
              }
            }
          }
        });
      }).to.throw(/Headers global not found/);

      await polly.stop();
    });
  });

  describe('Concurrency', function() {
    it('should prevent concurrent fetch adapter instances', async function() {
      const one = new Polly('one');
      const two = new Polly('two');

      one.connectTo(FetchAdapter);

      expect(function() {
        two.connectTo(FetchAdapter);
      }).to.throw(/Running concurrent fetch adapters is unsupported/);

      await one.stop();
      await two.stop();
    });

    it('should allow you to register new instances once stopped', async function() {
      const one = new Polly('one');
      const two = new Polly('two');

      one.connectTo(FetchAdapter);
      await one.stop();

      expect(function() {
        two.connectTo(FetchAdapter);
      }).to.not.throw();

      await one.stop();
      await two.stop();
    });
  });
});
