import Adapter from '@pollyjs/adapter';
import { URL } from '@pollyjs/utils';

const LISTENERS = Symbol();
const PASSTHROUGH_PROMISES = Symbol();
const PASSTHROUGH_REQ_ID_QP = 'pollyjs_passthrough_req_id';

export default class PuppeteerAdapter extends Adapter {
  static get id() {
    return 'puppeteer';
  }

  static get name() {
    // NOTE: deprecated in 4.1.0 but proxying since it's possible "core" is behind
    // and therefore still referencing `name`.  Remove in 5.0.0
    return this.id;
  }

  get defaultOptions() {
    return {
      page: null,
      requestResourceTypes: ['xhr', 'fetch']
    };
  }

  constructor() {
    super(...arguments);

    this._requestsMapping = {
      passthroughs: new WeakMap(),
      pollyRequests: new WeakMap()
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
      request: async request => {
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
            // on the request.
            if (!isPreFlightReq) {
              this._requestsMapping.passthroughs.set(
                request,
                this[PASSTHROUGH_PROMISES].get(
                  parsedUrl.query[PASSTHROUGH_REQ_ID_QP]
                )
              );
            }

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
              requestArguments: { request }
            });
          }
        } else {
          request.continue();
        }
      },
      requestfinished: request => {
        const response = request.response();
        const { passthroughs, pollyRequests } = this._requestsMapping;

        // Resolve the passthrough promise with the response if it exists
        if (passthroughs.has(request)) {
          passthroughs.get(request).resolve(response);
          passthroughs.delete(request);
        }

        // Resolve the deferred pollyRequest promise if it exists
        if (pollyRequests.has(request)) {
          pollyRequests.get(request).promise._resolve(response);
          pollyRequests.delete(request);
        }
      },
      requestfailed: request => {
        const error = request.failure();
        const { passthroughs, pollyRequests } = this._requestsMapping;

        // Reject the passthrough promise with the error object if it exists
        if (passthroughs.has(request)) {
          passthroughs.get(request).reject(error);
          passthroughs.delete(request);
        }

        // Reject the deferred pollyRequest promise with the error object if it exists
        if (pollyRequests.has(request)) {
          pollyRequests.get(request).promise._reject(error);
          pollyRequests.delete(request);
        }
      },
      close: () => this[LISTENERS].delete(page)
    });

    this._callListenersWith('prependListener', page);
  }

  onRequest(pollyRequest) {
    const { request } = pollyRequest.requestArguments;
    const { promise } = pollyRequest;

    // Override the deferred promise's resolve and reject to no-op since
    // we handle it manually in the `requestfinished` and `requestfailed` events.
    promise._resolve = promise.resolve;
    promise._reject = promise.reject;
    promise.resolve = promise.reject = () => {};

    /*
      Create an access point to the `pollyRequest` so it can be accessed from
      the emitted page events
    */
    this._requestsMapping.pollyRequests.set(request, pollyRequest);
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
          new Function(
            'url',
            'method',
            'headers',
            'body',
            'return fetch(url, { method, headers, body });'
          ),
          parsedUrl.toString(),
          method,
          headers,
          body
        );
      });

      return {
        statusCode: response.status(),
        headers: response.headers(),
        body: await response.text()
      };
    } catch (error) {
      throw error;
    } finally {
      this[PASSTHROUGH_PROMISES].delete(requestId);
    }
  }

  async respondToRequest(pollyRequest, error) {
    const { request } = pollyRequest.requestArguments;
    const { response } = pollyRequest;

    if (error) {
      // If an error was returned then we force puppeteer to abort the current
      // request. This will emit the `requestfailed` page event and allow the end
      // user to handle the error.
      await request.abort();
    } else {
      await request.respond({
        status: response.statusCode,
        headers: response.headers,
        body: response.body
      });
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
