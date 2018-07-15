import Adapter from '@pollyjs/adapter';

const LISTENERS = Symbol();
const PASSTHROUGH_PROMISE = Symbol();
const PASSTHROUGH_PROMISES = Symbol();
const PASSTHROUGH_REQ_ID_HEADER = 'x-pollyjs-passthrough-request-id';

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
    this[PASSTHROUGH_PROMISES] = new Map();
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
          const headers = request.headers();

          // If this is a polly passthrough request
          if (headers[PASSTHROUGH_REQ_ID_HEADER]) {
            // Get the associated promise object for the request id and set it
            // on the request
            request[PASSTHROUGH_PROMISE] = this[PASSTHROUGH_PROMISES].get(
              headers[PASSTHROUGH_REQ_ID_HEADER]
            );

            // Delete the header to remove any pollyjs footprint
            delete headers[PASSTHROUGH_REQ_ID_HEADER];

            // Continue the request with the headers override
            request.continue({ headers });
          } else {
            this.handleRequest({
              headers,
              url: request.url(),
              method: request.method(),
              body: request.postData(),
              requestArguments: [request]
            });
          }
        } else {
          request.continue();
        }
      },
      response: response => {
        const request = response.request();

        // Resolve the passthrough promise with the response if it exists
        request[PASSTHROUGH_PROMISE] &&
          request[PASSTHROUGH_PROMISE].resolve(response);

        delete request[PASSTHROUGH_PROMISE];
      },
      requestfailed: request => {
        // Reject the passthrough promise with the error object if it exists
        request[PASSTHROUGH_PROMISE] &&
          request[PASSTHROUGH_PROMISE].reject(request.failure());

        delete request[PASSTHROUGH_PROMISE];
      },
      close: () => this[LISTENERS].delete(page)
    });

    this._callListenersWith('prependListener', page);
  }

  async onRecord(pollyRequest) {
    await this.passthroughRequest(pollyRequest);
    await this.persister.recordRequest(pollyRequest);
    this.respondToPuppeteerRequest(pollyRequest);
  }

  async onReplay(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);
    this.respondToPuppeteerRequest(pollyRequest);
  }

  async onPassthrough(pollyRequest) {
    await this.passthroughRequest(pollyRequest);
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

  async passthroughRequest(pollyRequest) {
    const { page } = this.options;
    const { id, order, url, method, body } = pollyRequest;
    const requestId = `${this.polly.recordingId}:${id}:${order}`;
    const headers = {
      ...pollyRequest.headers,
      [PASSTHROUGH_REQ_ID_HEADER]: requestId
    };

    try {
      const response = await new Promise((resolve, reject) => {
        this[PASSTHROUGH_PROMISES].set(requestId, { resolve, reject });

        // This gets evaluated within the browser's context, meaning that
        // this fetch call executes from within the browser.
        page.evaluate((url, options) => fetch(url, options), url, {
          method,
          headers,
          body
        });
      });

      return pollyRequest.respond(
        response.status(),
        response.headers(),
        await response.text()
      );
    } catch (error) {
      throw error;
    } finally {
      this[PASSTHROUGH_PROMISES].delete(requestId);
    }
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
