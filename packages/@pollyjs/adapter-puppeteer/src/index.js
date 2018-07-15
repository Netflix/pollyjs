import Adapter from '@pollyjs/adapter';
import fetch from 'node-fetch';
import { Fetch as FetchUtils } from '@pollyjs/utils';

const LISTENERS = Symbol();

export default class PuppeteerAdapter extends Adapter {
  static get name() {
    return 'puppeteer';
  }

  get defaultOptions() {
    return {
      page: null,
      requestResourceTypes: ['xhr', 'fetch']
    };
  }

  onConnect() {
    const { page } = this.options;

    this[LISTENERS] = new Map();
    this.assert('A puppeteer page instance is required.', page);
    this.attachToPageEvents(page);
  }

  onDisconnect() {
    this[LISTENERS].forEach((_, target) =>
      this._callListenersWith('removeListener', target)
    );
  }

  attachToPageEvents(page) {
    const { requestResourceTypes } = this.options;

    this[LISTENERS].set(page, {
      request: request => {
        if (requestResourceTypes.includes(request.resourceType())) {
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
      close: () => this[LISTENERS].delete(page)
    });

    this._callListenersWith('prependListener', page);
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
      FetchUtils.serializeHeaders(response.headers),
      await response.text()
    );
  }

  _callListenersWith(methodName, target) {
    if (this[LISTENERS].has(target)) {
      const listeners = this[LISTENERS].get(target);

      for (const eventName in listeners) {
        target[methodName].apply(target, [eventName, listeners[eventName]]);
      }
    }
  }
}
