import { Polly, setupMocha as setupPolly } from '@pollyjs/core';
import { URL } from '@pollyjs/utils';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';

import FetchAdapter from '../../src';
import pollyConfig from '../utils/polly-config';

class MockResponse {}
class MockHeaders {}

describe('Integration | Fetch Adapter', function() {
  setupPolly.beforeEach(pollyConfig);

  setupFetchRecord();
  setupPolly.afterEach();

  adapterTests();
  adapterBrowserTests();

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
});

describe('Integration | Fetch Adapter | Init', function() {
  describe('Context', function() {
    it(`should assign context's fetch as the native fetch`, async function() {
      const polly = new Polly('context', { adapters: [] });
      const fetch = () => {};
      const adapterOptions = {
        fetch: {
          context: { fetch, Response: MockResponse, Headers: MockHeaders }
        }
      };

      polly.configure({
        adapters: [FetchAdapter],
        adapterOptions
      });

      expect(polly.adapters.get('fetch').native).to.equal(fetch);
      expect(polly.adapters.get('fetch').native).to.not.equal(
        adapterOptions.fetch.context.fetch
      );

      expect(function() {
        polly.configure({
          adapterOptions: { fetch: { context: {} } }
        });
      }).to.throw(/fetch global not found/);

      await polly.stop();
    });

    it('should throw when context, fetch, Response, and Headers are undefined', async function() {
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
              context: { fetch() {}, Response: undefined, Headers: MockHeaders }
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
