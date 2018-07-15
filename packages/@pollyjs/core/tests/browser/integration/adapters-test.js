import { setupMocha as setupPolly } from '../../../src';
import setupFetch from '../helpers/setup-fetch';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import adapterBrowserTests from '@pollyjs-tests/integration/adapter-browser-tests';
import Configs from './configs';

describe('Integration | Adapters', function() {
  for (const name in Configs) {
    const defaults = Configs[name];

    describe(name, function() {
      setupPolly.beforeEach(defaults);
      setupFetch();
      setupFetchRecord();
      setupPolly.afterEach();

      adapterTests();
      adapterBrowserTests();
    });
  }
});
