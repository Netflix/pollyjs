import { setupMocha as setupPolly } from '@pollyjs/core';
import { PollyError } from '@pollyjs/utils';

import PuppeteerAdapter from '../../src';

describe('Unit | Puppeteer Adapter', function() {
  setupPolly();

  it('should throw without a page instance', function() {
    expect(() =>
      this.polly.configure({
        adapters: [PuppeteerAdapter]
      })
    ).to.throw(PollyError, /A puppeteer page instance is required/);
  });
});
