import Adapter from '@pollyjs/adapter';
import isNode from 'detect-node';

import serializeHeaders from './utils/serializer-headers';

const { defineProperty } = Object;
const IS_STUBBED = Symbol();
const REQUEST_ARGUMENTS = Symbol();

export default class FetchAdapter extends Adapter {
  static get id() {
    return 'fetch';
  }

  static get name() {
    // NOTE: deprecated in 4.1.0 but proxying since it's possible "core" is behind
    // and therefore still referencing `name`.  Remove in 5.0.0
    return this.id;
  }

  get defaultOptions() {
    return {
      context: global
    };
  }

  onConnect() {
    const { context } = this.options;

    if (isNode) {
      console.warn(
        '[Polly] [adapter:fetch] Using the fetch adapter in Node has been deprecated. Please use the node-http adapter instead.'
      );
    }

    ['fetch', 'Request', 'Response', 'Headers'].forEach(key =>
      this.assert(`${key} global not found.`, !!(context && context[key]))
    );
    this.assert(
      'Running concurrent fetch adapters is unsupported, stop any running Polly instances.',
      !context.fetch[IS_STUBBED] && !context.Request[IS_STUBBED]
    );

    this.nativeFetch = context.fetch;
    this.NativeRequest = context.Request;

    const NativeRequest = this.NativeRequest;

    /*
      Patch the Request constructor so we can store all the passed in options.
      This allows us to access the `body` directly instead of having to do
      `await req.blob()` as well as not having to hard code each option we want
      to extract from the Request instance.
    */
    context.Request = function Request(url, options) {
      const request = new NativeRequest(url, options);
      let args;

      options = options || {};

      /*
        The Request constructor can receive another Request instance as
        the first argument so we use its arguments and merge it with the
        new options.
     */
      if (typeof url === 'object' && url[REQUEST_ARGUMENTS]) {
        const reqArgs = url[REQUEST_ARGUMENTS];

        args = { ...reqArgs, options: { ...reqArgs.options, ...options } };
      } else {
        args = { url, options };
      }

      defineProperty(request, REQUEST_ARGUMENTS, { value: args });

      // Override the clone method to use our overridden constructor
      request.clone = function clone() {
        return new context.Request(request);
      };

      return request;
    };

    defineProperty(context.Request, IS_STUBBED, { value: true });

    context.fetch = (url, options = {}) => {
      let respond;

      // Support Request object
      if (typeof url === 'object' && url[REQUEST_ARGUMENTS]) {
        const req = url;
        const reqArgs = req[REQUEST_ARGUMENTS];

        url = reqArgs.url;
        options = { ...reqArgs.options, ...options };

        // If a body exists in the Request instance, mimic reading the body
        if ('body' in reqArgs.options) {
          defineProperty(req, 'bodyUsed', { value: true });
        }
      }

      const promise = new Promise((resolve, reject) => {
        respond = ({ response, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        };
      });

      this.handleRequest({
        url,
        method: options.method || 'GET',
        headers: serializeHeaders(new context.Headers(options.headers)),
        body: options.body,
        requestArguments: { options, respond }
      });

      return promise;
    };

    defineProperty(context.fetch, IS_STUBBED, { value: true });
  }

  onDisconnect() {
    const { context } = this.options;

    context.fetch = this.nativeFetch;
    context.Request = this.NativeRequest;

    this.nativeFetch = null;
    this.NativeRequest = null;
  }

  onRequest(pollyRequest) {
    const { options } = pollyRequest.requestArguments;

    if (options.signal) {
      if (options.signal.aborted) {
        pollyRequest.abort();
      } else {
        options.signal.addEventListener('abort', () => pollyRequest.abort());
      }
    }
  }

  async passthroughRequest(pollyRequest) {
    const { context } = this.options;
    const { options } = pollyRequest.requestArguments;

    const response = await this.nativeFetch.apply(context, [
      pollyRequest.url,
      {
        ...options,
        method: pollyRequest.method,
        headers: pollyRequest.headers,
        body: pollyRequest.body
      }
    ]);

    return {
      statusCode: response.status,
      headers: serializeHeaders(response.headers),
      body: await response.text()
    };
  }

  respondToRequest(pollyRequest, error) {
    const {
      context: { Response }
    } = this.options;
    const { respond } = pollyRequest.requestArguments;

    if (pollyRequest.aborted) {
      respond({
        error: new DOMException(
          'The user aborted a request.',
          DOMException.ABORT_ERR
        )
      });

      return;
    }

    if (error) {
      respond({ error });

      return;
    }

    const { absoluteUrl, response: pollyResponse } = pollyRequest;
    const { statusCode } = pollyResponse;
    const responseBody =
      statusCode === 204 && pollyResponse.body === ''
        ? null
        : pollyResponse.body;
    const response = new Response(responseBody, {
      status: statusCode,
      headers: pollyResponse.headers
    });

    /*
      Response does not allow `url` to be set manually (either via the
      constructor or assignment) so force the url property via `defineProperty`.
    */
    defineProperty(response, 'url', { value: absoluteUrl });

    respond({ response });
  }
}
