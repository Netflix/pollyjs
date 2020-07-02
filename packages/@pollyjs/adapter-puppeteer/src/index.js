import Adapter from '@pollyjs/adapter';

const LISTENERS = Symbol();
const PASSTHROUGH_PROMISES = Symbol();

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
        const url = request.url();
        const method = request.method();
        const headers = request.headers();

        // A CORS preflight request is a CORS request that checks to see
        // if the CORS protocol is understood.
        const isPreFlightReq =
          method === 'OPTIONS' &&
          !!headers['origin'] &&
          !!headers['access-control-request-method'];

        if (
          isPreFlightReq ||
          !requestResourceTypes.includes(request.resourceType())
        ) {
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
      },
      requestfinished: request => {
        const response = request.response();
        const { passthroughs, pollyRequests } = this._requestsMapping;

        // Resolve the passthrough promise with the response if it exists
        if (passthroughs.has(request)) {
          passthroughs.get(request).resolve(response);
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
    const { passthroughs, pollyRequests } = this._requestsMapping;

    if (passthroughs.has(request)) {
      return;
    }
    // Override the deferred promise's resolve and reject to no-op since
    // we handle it manually in the `requestfinished` and `requestfailed` events.
    promise._resolve = promise.resolve;
    promise._reject = promise.reject;
    promise.resolve = promise.reject = () => {};

    /*
      Create an access point to the `pollyRequest` so it can be accessed from
      the emitted page events
    */
    pollyRequests.set(request, pollyRequest);
  }

  async passthroughRequest(pollyRequest) {
    const {
      requestArguments: { request }
    } = pollyRequest;
    const { passthroughs } = this._requestsMapping;
    let resolve;
    let reject;
    const responsePromise = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });

    passthroughs.set(request, { resolve, reject });
    await request.continue();
    const response = await responsePromise;

    return {
      statusCode: response.status(),
      headers: response.headers(),
      body: await response.text().catch(() => '')
    };
  }

  async respondToRequest(pollyRequest, error) {
    const { request } = pollyRequest.requestArguments;
    const { response } = pollyRequest;
    const { passthroughs } = this._requestsMapping;

    // Do nothing for passthrough requests: they have already been handled.
    if (passthroughs.has(request)) {
      passthroughs.delete(request);

      return;
    }
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
