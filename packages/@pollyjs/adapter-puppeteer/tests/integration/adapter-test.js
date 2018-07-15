import FSPersister from '@pollyjs/persister-fs';
import PuppeteerAdapter from '../../src';
import puppeteer from 'puppeteer';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import setupFetch from '../helpers/setup-fetch';
import adapterTests from '@pollyjs-tests/integration/adapter-tests';
import { setupMocha as setupPolly } from '@pollyjs/core';

// The host the API server is on
const HOST = 'http://localhost:4000';

describe('Integration | Puppeteer Adapter', function() {
  before(async function() {
    this.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  });

  after(async function() {
    await this.browser.close();
  });

  setupPolly.beforeEach({
    recordFailedRequests: true,
    persister: FSPersister,
    persisterOptions: {
      fs: { recordingsDir: 'tests/recordings' }
    },
    matchRequestsBy: {
      headers: {
        exclude: [
          // We don't want new recordings when we update chrome
          'user-agent',
          // This is a unique ID which breaks the request matching
          'x-devtools-emulate-network-conditions-client-id'
        ]
      }
    }
  });

  setupFetch();
  setupFetchRecord({ host: HOST });

  beforeEach(async function() {
    this.page = await this.browser.newPage();
    await this.page.setRequestInterception(true);

    this.polly.configure({
      adapters: [PuppeteerAdapter],
      adapterOptions: {
        puppeteer: { page: this.page }
      }
    });

    await this.page.goto(HOST);
  });

  afterEach(async function() {
    await this.page.close();
  });

  setupPolly.afterEach();

  adapterTests();
});
