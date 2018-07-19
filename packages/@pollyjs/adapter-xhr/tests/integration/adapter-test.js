import { Polly, setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import RESTPersister from '@pollyjs/persister-rest';
import xhrRequest from '@pollyjs-tests/helpers/xhr-request';
import XHRAdapter from '../../src';

describe('Integration | XHR Adapter', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [XHRAdapter],
    persister: RESTPersister,
    persisterOptions: {
      rest: { host: '' }
    }
  });

  setupFetchRecord({
    fetch() {
      return xhrRequest(...arguments);
    }
  });
  setupPolly.afterEach();

  adapterTests();
  adapterBrowserTests();
});

describe('Integration | XHR Adapter | Concurrency', function() {
  it('should prevent concurrent XHR adapter instances', async function() {
    const one = new Polly('one');
    const two = new Polly('two');

    one.connectTo(XHRAdapter);

    expect(function() {
      two.connectTo(XHRAdapter);
    }).to.throw(/Running concurrent XHR adapters is unsupported/);

    await one.stop();
    await two.stop();
  });

  it('should allow you to register new instances once stopped', async function() {
    const one = new Polly('one');
    const two = new Polly('two');

    one.connectTo(XHRAdapter);
    await one.stop();

    expect(function() {
      two.connectTo(XHRAdapter);
    }).to.not.throw();

    await one.stop();
    await two.stop();
  });
});
