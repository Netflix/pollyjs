import { Polly, setupMocha as setupPolly } from '@pollyjs/core';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import adapterIdentifierTests from '@pollyjs-tests/integration/adapter-identifier-tests';
import InMemoryPersister from '@pollyjs/persister-in-memory';

import xhrRequest from '../utils/xhr-request';
import XHRAdapter from '../../src';

class MockXMLHttpRequest {}

describe('Integration | XHR Adapter', function() {
  setupPolly.beforeEach({
    recordFailedRequests: true,
    adapters: [XHRAdapter],
    persister: InMemoryPersister
  });

  setupFetchRecord({
    fetch() {
      return xhrRequest(...arguments);
    }
  });
  setupPolly.afterEach();

  adapterTests();
  adapterBrowserTests();
  adapterIdentifierTests();
});

describe('Integration | XHR Adapter | Init', function() {
  describe('Context', function() {
    it(`should assign context's XMLHttpRequest as the native XMLHttpRequest`, async function() {
      const polly = new Polly('context', { adapters: [] });
      const adapterOptions = {
        xhr: {
          context: { XMLHttpRequest: MockXMLHttpRequest }
        }
      };

      polly.configure({
        adapters: [XHRAdapter],
        adapterOptions
      });

      expect(polly.adapters.get('xhr').NativeXMLHttpRequest).to.equal(
        MockXMLHttpRequest
      );
      expect(polly.adapters.get('xhr').NativeXMLHttpRequest).to.not.equal(
        adapterOptions.xhr.context.XMLHttpRequest
      );

      expect(function() {
        polly.configure({
          adapterOptions: { xhr: { context: {} } }
        });
      }).to.throw(/XHR global not found/);

      await polly.stop();
    });
  });

  describe('Concurrency', function() {
    it('should prevent concurrent XHR adapter instances on the same context', async function() {
      const one = new Polly('one');
      const two = new Polly('two');
      const three = new Polly('three', {
        adapterOptions: {
          xhr: {
            context: { XMLHttpRequest: MockXMLHttpRequest }
          }
        }
      });

      one.connectTo(XHRAdapter);

      expect(function() {
        two.connectTo(XHRAdapter);
      }).to.throw(/Running concurrent XHR adapters is unsupported/);

      three.connectTo(XHRAdapter);

      await one.stop();
      await two.stop();
      await three.stop();
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
});
