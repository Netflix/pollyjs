import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import { setupMocha as setupPolly, Polly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

import { expect } from 'chai';

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);
let browser: any;
let page: any;
describe('Puppeteer Suite', async function() {
  setupPolly();
  beforeEach(async function() {
    browser = await puppeteer.launch({headless: false, slowMo: 1000});
    page = await browser.newPage();
    await page.setRequestInterception(true);

    this.polly.configure({
      adapterOptions: { puppeteer: { page } },
      adapters: ['puppeteer'],
      matchRequestsBy: {
        headers: {
          exclude: ['user-agent'],
        },
      },
      mode: 'record',
      persister: 'fs',
      persisterOptions: {
        fs: {
          recordingsDir: path.resolve(__dirname, '../__recordings__'),
        },
      },
      recordIfMissing: true,
    });

    const { server } = this.polly;

    server.host('http://localhost:3000', () => {
      server.get('/sockjs-node/*').intercept((_, res) => res.sendStatus(200));
    });
    
    await page.goto('http://localhost:3000', {waitUntil: 'load', timeout: 0});
  });

  afterEach(async function() {
      await browser.close();
    });

  it('should be able to navigate to all routes', async function() {
      expect(await page.$eval('h2', e => { return e.innerText; })).to.equal('Posts');
      expect(await page.$eval('tbody > tr', e => { return e.innerText; })).to.not.equal(null);
      const elements: any = await page.$$('a.MenuItemLink-root-243');
      await elements[1].click();
      expect(await page.$eval('h2', e => { return e.innerText; })).to.equal('Todos');
      expect(await page.$eval('tbody > tr', e => { return e.innerText; })).to.not.equal(null);
      await elements[2].click();
      expect(await page.$eval('h2', e => { return e.innerText; })).to.equal('Users');
      expect(await page.$eval('tbody > tr', e => { return e.innerText; })).to.not.equal(null);

      // Wait for all requests to resolve, this can also be replaced with
      await this.polly.flush();
    });
});
