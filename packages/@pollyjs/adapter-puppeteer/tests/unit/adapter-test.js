import PuppeteerAdapter from '../../src';
import { setupMocha as setupPolly } from '@pollyjs/core';

describe('Unit | Puppeteer Adapter', function() {
  setupPolly();

  it('should throw without a page instance', function() {
    expect(() =>
      this.polly.configure({
        adapters: [PuppeteerAdapter]
      })
    ).to.throw(Error, /A puppeteer page instance is required/);
  });
});
