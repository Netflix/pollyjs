import { setupMocha as setupPolly, Polly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import RESTPersister from '@pollyjs/persister-rest';
import FetchAdapter from '../../src';

describe('Integration | Fetch Adapter', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [FetchAdapter],
    persister: RESTPersister,
    persisterOptions: {
      rest: { host: '' }
    }
  });

  setupFetchRecord();
  setupPolly.afterEach();

  adapterTests();
  adapterBrowserTests();
});

describe('Integration | Fetch Adapter | Context', function() {
  it(`should assign context's fetch as the native fetch`, async function() {
    const polly = new Polly('context', { adapters: [] });
    const adapterOptions = {
      fetch: {
        context: {
          fetch() {}
        }
      }
    };

    polly.configure({
      adapters: [FetchAdapter],
      adapterOptions
    });

    expect(polly.adapters.get('fetch').native).to.equal(
      adapterOptions.fetch.context.fetch
    );

    expect(function() {
      polly.configure({
        adapterOptions: {
          fetch: {
            context: undefined
          }
        }
      });
    }).to.throw(`[Polly] [adapter:fetch] Fetch global not found.`);

    await polly.stop();
  });

  it('should throw when context and fetch are undefined', async function() {
    const polly = new Polly('context', { adapters: [] });

    polly.configure({
      adapters: [FetchAdapter]
    });

    expect(function() {
      polly.configure({
        adapterOptions: {
          fetch: {
            context: undefined
          }
        }
      });
    }).to.throw(`[Polly] [adapter:fetch] Fetch global not found.`);

    expect(function() {
      polly.configure({
        adapterOptions: {
          fetch: {
            context: {
              fetch: undefined
            }
          }
        }
      });
    }).to.throw(`[Polly] [adapter:fetch] Fetch global not found.`);

    await polly.stop();
  });
});

describe('Integration | Fetch Adapter | Concurrency', function() {
  it('should prevent concurrent fetch adapter instances', async function() {
    const one = new Polly('one');
    const two = new Polly('two');

    one.connectTo(FetchAdapter);

    expect(function() {
      two.connectTo(FetchAdapter);
    }).to.throw(
      `[Polly] [adapter:fetch] Running concurrent fetch adapters is unsupported, stop any running Polly instances.`
    );

    await one.stop();
    await two.stop();
  });

  it('should allow you to register new instances once stopped', async function() {
    const one = new Polly('one');
    const two = new Polly('two');

    one.connectTo(FetchAdapter);
    one.stop();

    expect(function() {
      two.connectTo(FetchAdapter);
    }).to.not.throw();

    await one.stop();
    await two.stop();
  });
});
