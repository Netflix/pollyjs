import FSPersister from '@pollyjs/persister-fs';
import PuppeteerAdapter from '../../src';
import puppeteer from 'puppeteer';
import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
import fetch from '../helpers/fetch';
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

  setupFetchRecord({ host: HOST });

  beforeEach(function() {
    // Override this.fetch here since it needs access to the current context
    this.fetch = fetch.bind(this);
  });

  beforeEach(async function() {
    this.page = await this.browser.newPage();

    await this.page.goto(`${HOST}/api`);
    await this.page.setRequestInterception(true);

    this.polly.configure({
      adapters: [PuppeteerAdapter],
      adapterOptions: {
        puppeteer: { page: this.page }
      }
    });
  });

  afterEach(async function() {
    await this.page.close();
  });

  setupPolly.afterEach();

  adapterTests();

  it('should have resolved requests after flushing', async function() {
    // Timeout after 500ms since we could have a hanging while loop
    this.timeout(500);

    const { server } = this.polly;
    const requests = [];
    const resolved = [];
    let i = 1;

    server
      .get(this.recordUrl())
      .intercept(async (req, res) => {
        await server.timeout(5);
        res.sendStatus(200);
      })
      .on('request', req => requests.push(req));

    this.page.on('requestfinished', () => resolved.push(i++));

    this.fetchRecord();
    this.fetchRecord();
    this.fetchRecord();

    // Since it takes time for Puppeteer to execute the request in the browser's
    // context, we have to wait until the requests have been made.
    while (requests.length !== 3) {
      await server.timeout(5);
    }

    await this.polly.flush();

    expect(requests).to.have.lengthOf(3);
    requests.forEach(request => expect(request.didRespond).to.be.true);
    expect(resolved).to.have.members([1, 2, 3]);
  });
});
