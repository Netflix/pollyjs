import { setupMocha as setupPolly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import PuppeteerAdapter from '../../src';
import puppeteer from 'puppeteer';
import setupFetch from '../helpers/setup-fetch';

describe('Integration | Puppeteer Adapter', function() {
  setupPolly.beforeEach({
    persister: FSPersister,
    recordFailedRequests: true,
    matchRequestsBy: {
      headers: {
        exclude: [
          'user-agent',
          'x-devtools-emulate-network-conditions-client-id'
        ]
      }
    }
  });

  beforeEach(async function() {
    this.browser = await puppeteer.launch();
    this.polly.configure({
      adapters: [PuppeteerAdapter],
      adapterOptions: {
        puppeteer: { browser: this.browser }
      }
    });
    this.page = await this.browser.newPage();
    await this.page.goto('http://localhost:4000');
  });

  setupFetch();
  setupPolly.afterEach();

  afterEach(async function() {
    await this.browser.close();
  });

  it.only('works', async function() {
    const { status } = await this.fetchRecord();

    expect(status).to.equal(404);
  });
});
