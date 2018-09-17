const path = require('path');
const { Polly } = require('@pollyjs/core');
const PuppeteerAdapter = require('@pollyjs/adapter-puppeteer');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

let polly;

describe('jest-puppeteer', () => {
  beforeEach(async () => {
    jest.setTimeout(60000);

    await page.setRequestInterception(true);

    polly = new Polly('jest-puppeteer', {
      adapters: ['puppeteer'],
      adapterOptions: { puppeteer: { page } },
      persister: 'fs',
      persisterOptions: {
        fs: {
          recordingsDir: path.resolve(__dirname, '../recordings')
        }
      }
    });

    const { server } = polly;

    server.host('http://localhost:3000', () => {
      server.get('/favicon.ico').passthrough();
      server.get('/sockjs-node/*').intercept((_, res) => res.sendStatus(200));
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  });

  afterEach(async () => {
    await polly.flush();
    await polly.stop();
  });

  it('should be able to navigate to all routes', async () => {
    const header = await page.$('header');

    await expect(page).toMatchElement('tbody > tr', { timeout: 5000 });
    await expect(header).toMatch('Posts');

    await expect(page).toClick('a', { text: 'Todos' });
    await expect(page).toMatchElement('tbody > tr', { timeout: 5000 });
    await expect(header).toMatch('Todos');

    await expect(page).toClick('a', { text: 'Users' });
    await expect(page).toMatchElement('tbody > tr', { timeout: 5000 });
    await expect(header).toMatch('Users');
  });
});
