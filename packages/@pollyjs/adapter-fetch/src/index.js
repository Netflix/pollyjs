import Adapter from '@pollyjs/adapter';
import isNode from 'detect-node';

import serializeHeaders from './utils/serializer-headers';

const { defineProperty } = Object;
const IS_STUBBED = Symbol();

export default class FetchAdapter extends Adapter {
  static get name() {
    return 'fetch';
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

    ['fetch', 'Response', 'Headers'].forEach(key =>
      this.assert(`${key} global not found.`, !!(context && context[key]))
    );
    this.assert(
      'Running concurrent fetch adapters is unsupported, stop any running Polly instances.',
      !context.fetch[IS_STUBBED]
    );

    this.native = context.fetch;

    context.fetch = (url, options = {}) => {
      // Support Request object
      if (typeof url === 'object' && 'url' in url) {
        url = url.url;
      }

      let respond;
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
    this.options.context.fetch = this.native;
    this.native = null;
  }

  async passthroughRequest(pollyRequest) {
    const { options } = pollyRequest.requestArguments;

    const response = await this.native.apply(global, [
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

    if (error) {
      respond({ error });

      return;
    }

    const { absoluteUrl, response } = pollyRequest;
    const { statusCode } = response;
    const responseBody =
      statusCode === 204 && response.body === '' ? null : response.body;

    const fetchResponse = new Response(responseBody, {
      status: statusCode,
      headers: response.headers
    });

    /*
      Response does not allow `url` to be set manually (either via the
      constructor or assignment) so force the url property via `defineProperty`.
    */
    defineProperty(fetchResponse, 'url', { value: absoluteUrl });

    respond({ response: fetchResponse });
  }
}
