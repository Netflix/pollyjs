const path = require('path');

const { Polly } = require('@pollyjs/core');
const { setupPolly } = require('setup-polly-jest');
const PuppeteerAdapter = require('@pollyjs/adapter-puppeteer');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

describe('jest-puppeteer', () => {
  const context = setupPolly({
    adapters: ['puppeteer'],
    adapterOptions: { puppeteer: { page } },
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../__recordings__')
      }
    },
    matchRequestsBy: {
      headers: {
        exclude: ['user-agent']
      }
    }
  });

  beforeEach(async () => {
    jest.setTimeout(60000);

    await page.setRequestInterception(true);

    const { server } = context.polly;

    server.host('http://localhost:3000', () => {
      server.get('/sockjs-node/*').intercept((_, res) => res.sendStatus(200));
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
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

    // Wait for all requests to resolve, this can also be replaced with
    // `await context.polly.flush()`
    await page.waitForResponse(() => true);
  });
});
