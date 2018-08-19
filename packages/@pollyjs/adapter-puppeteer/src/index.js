import Adapter from '@pollyjs/adapter';
import { URL } from '@pollyjs/utils';

const LISTENERS = Symbol();
const POLLY_REQUEST = Symbol();
const PASSTHROUGH_PROMISE = Symbol();
const PASSTHROUGH_PROMISES = Symbol();
const PASSTHROUGH_REQ_ID_QP = 'pollyjs_passthrough_req_id';

export default class PuppeteerAdapter extends Adapter {
  static get name() {
    return 'puppeteer';
  }

  get defaultOptions() {
    return {
      page: null,

      /* NOTE: `"other" is needed as of puppeteer 1.7.0 to capture the passthrough request */
      requestResourceTypes: ['xhr', 'fetch', 'other']
    };
  }

  onConnect() {
    const { page } = this.options;

    this[LISTENERS] = new Map();
    this[PASSTHROUGH_PROMISES] = new Map();
    this.assert(
      'A puppeteer page instance is required.',
      !!(page && typeof page === 'object')
    );
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
          const url = request.url();
          const method = request.method();
          const headers = request.headers();

          // A CORS preflight request is a CORS request that checks to see
          // if the CORS protocol is understood.
          const isPreFlightReq =
            method === 'OPTIONS' &&
            !!headers['origin'] &&
            !!headers['access-control-request-method'];

          // Do not intercept requests with the Polly passthrough QP
          if (url.includes(PASSTHROUGH_REQ_ID_QP)) {
            const parsedUrl = new URL(url, true);

            // If this is a polly passthrough request
            // Get the associated promise object for the request id and set it
            // on the request
            request[PASSTHROUGH_PROMISE] = this[PASSTHROUGH_PROMISES].get(
              parsedUrl.query[PASSTHROUGH_REQ_ID_QP]
            );

            // Delete the query param to remove any pollyjs footprint
            delete parsedUrl.query[PASSTHROUGH_REQ_ID_QP];

            // Continue the request with the url override
            request.continue({ url: parsedUrl.toString() });
          } else if (isPreFlightReq) {
            // Do not intercept preflight requests
            request.continue();
          } else {
            this.handleRequest({
              headers,
              url,
              method,
              body: request.postData(),
              requestArguments: [request]
            });
          }
        } else {
          request.continue();
        }
      },
      requestfinished: request => {
        const response = request.response();

        // Resolve the passthrough promise with the response if it exists
        if (request[PASSTHROUGH_PROMISE]) {
          request[PASSTHROUGH_PROMISE].resolve(response);
          delete request[PASSTHROUGH_PROMISE];
        }

        // Resolve the deferred pollyRequest promise if it exists
        if (request[POLLY_REQUEST]) {
          request[POLLY_REQUEST].promise.resolve(response);
          delete request[POLLY_REQUEST];
        }
      },
      requestfailed: request => {
        const error = request.failure();

        // Reject the passthrough promise with the error object if it exists
        if (request[PASSTHROUGH_PROMISE]) {
          request[PASSTHROUGH_PROMISE].reject(error);
          delete request[PASSTHROUGH_PROMISE];
        }

        // Reject the deferred pollyRequest promise with the error object if it exists
        if (request[POLLY_REQUEST]) {
          request[POLLY_REQUEST].promise.reject(error);
          delete request[POLLY_REQUEST];
        }
      },
      close: () => this[LISTENERS].delete(page)
    });

    this._callListenersWith('prependListener', page);
  }

  onRequest(pollyRequest) {
    const [request] = pollyRequest.requestArguments;

    /*
      Create an access point to the `pollyRequest` so it can be accessed from
      the emitted page events
    */
    request[POLLY_REQUEST] = pollyRequest;
  }

  /**
   * Override the onRequestFinished logic as it doesn't apply to this adapter.
   * Instead, that logic is re-implemented via the `requestfinished` page
   * event.
   *
   * @override
   */
  onRequestFinished() {}

  /**
   * Abort the request on failure. The parent `onRequestFailed` has been
   * re-implemented via the `requestfailed` page event.
   *
   * @override
   */
  async onRequestFailed(pollyRequest) {
    const [request] = pollyRequest.requestArguments;

    await request.abort();
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
    const { id, order, url, method, headers, body } = pollyRequest;
    const requestId = `${this.polly.recordingId}:${id}:${order}`;
    const parsedUrl = new URL(url, true);

    parsedUrl.query[PASSTHROUGH_REQ_ID_QP] = requestId;

    try {
      const response = await new Promise((resolve, reject) => {
        this[PASSTHROUGH_PROMISES].set(requestId, { resolve, reject });

        // This gets evaluated within the browser's context, meaning that
        // this fetch call executes from within the browser.
        page.evaluate(
          (url, options) => fetch(url, options),
          parsedUrl.toString(),
          { method, headers, body }
        );
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
