import Adapter from '@pollyjs/adapter';
import fetch from 'node-fetch';

const LISTENERS = new Map();

/**
 * Serialize a Headers instance into a pojo since it cannot be stringified.
 * @param {*} headers
 */
function serializeHeaders(headers) {
  if (headers && typeof headers.forEach === 'function') {
    const serializedHeaders = {};

    headers.forEach((value, key) => (serializedHeaders[key] = value));

    return serializedHeaders;
  }

  return headers || {};
}

function callListenersWith(methodName, target) {
  if (LISTENERS.has(target)) {
    const listeners = LISTENERS.get(target);

    for (const eventName in listeners) {
      target[methodName].apply(target, [eventName, listeners[eventName]]);
    }
  }
}

export default class PuppeteerAdapter extends Adapter {
  static get name() {
    return 'puppeteer';
  }

  onConnect() {
    const { browser } = this.polly.config.adapterOptions.puppeteer;

    this.assert('A puppeteer browser instance is required.', browser);

    LISTENERS.set(browser, {
      targetcreated: async target => {
        const page = await target.page();

        if (page) {
          await page.setRequestInterception(true);

          LISTENERS.set(page, {
            request: request => {
              if (['xhr', 'fetch'].includes(request.resourceType())) {
                this.handleRequest({
                  url: request.url(),
                  method: request.method() || 'GET',
                  headers: request.headers(),
                  body: request.postData(),
                  requestArguments: [request]
                });
              } else {
                request.continue();
              }
            },
            close: () => LISTENERS.delete(page)
          });

          callListenersWith('prependListener', page);
        }
      },
      targetdestroyed: () => LISTENERS.delete(browser)
    });

    callListenersWith('prependListener', browser);
  }

  onDisconnect() {
    LISTENERS.forEach((_, target) =>
      callListenersWith('removeListener', target)
    );
  }

  async onRecord(pollyRequest) {
    await this._passthroughRequest(pollyRequest);
    await this.persister.recordRequest(pollyRequest);
        this.respondToPuppeteerRequest(pollyRequest);
  }

  async onReplay(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);
    this.respondToPuppeteerRequest(pollyRequest);
  }

  async onPassthrough(pollyRequest) {
    await this._passthroughRequest(pollyRequest);
    this.respondToPuppeteerRequest(pollyRequest);
  }

  async onIntercept(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);
    this.respondToPuppeteerRequest(pollyRequest);
  }

  respondToPuppeteerRequest(pollyRequest) {
    const [request] = pollyRequest.requestArguments;
    const { statusCode: status, headers, body } = pollyRequest.response;

    request.respond({ status, headers, body });
  }

  async _passthroughRequest(pollyRequest) {
    const response = await fetch(pollyRequest.url, {
      method: pollyRequest.method,
      headers: pollyRequest.headers,
      body: pollyRequest.body
    });

    return pollyRequest.respond(
      response.status,
      serializeHeaders(response.headers),
      await response.text()
    );
  }
}
