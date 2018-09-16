const path = require('path');
const puppeteer = require('puppeteer');
const { Polly } = require('@pollyjs/core');
const PuppeteerAdapter = require('@pollyjs/adapter-puppeteer');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  const polly = new Polly('puppeteer', {
    adapters: ['puppeteer'],
    adapterOptions: { puppeteer: { page } },
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.join(__dirname, 'recordings')
      }
    }
  });

  const { server } = polly;

  server.host('http://localhost:3000', () => {
    server.get('/favicon.ico').passthrough();
    server.get('/sockjs-node/*').intercept((_, res) => res.sendStatus(200));
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.goto('http://localhost:3000/#/todos', {
    waitUntil: 'networkidle0'
  });
  await page.goto('http://localhost:3000/#/users', {
    waitUntil: 'networkidle0'
  });

  await polly.flush();
  await polly.stop();
  await browser.close();
})();
