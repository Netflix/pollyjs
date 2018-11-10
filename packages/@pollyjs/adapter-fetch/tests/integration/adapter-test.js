import { Polly } from '@pollyjs/core';

import FetchAdapter from '../../src';

class MockResponse {}

describe('Integration | Fetch Adapter', function() {
  describe('Context', function() {
    it(`should assign context's fetch as the native fetch`, async function() {
      const polly = new Polly('context', { adapters: [] });
      const adapterOptions = {
        fetch: {
          context: {
            fetch() {},
            Response: MockResponse
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
      }).to.throw(/Fetch global not found/);

      await polly.stop();
    });

    it('should throw when context, fetch, and Response are undefined', async function() {
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
      }).to.throw(/Fetch global not found/);

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
      }).to.throw(/Fetch global not found/);

      expect(function() {
        polly.configure({
          adapterOptions: {
            fetch: {
              context: {
                fetch() {},
                Response: undefined
              }
            }
          }
        });
      }).to.throw(/Response global not found/);

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
