import Adapter from '@pollyjs/adapter';

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

    this.assert('Fetch global not found.', !!(context && context.fetch));
    this.assert('Response global not found.', !!(context && context.Response));
    this.assert(
      'Running concurrent fetch adapters is unsupported, stop any running Polly instances.',
      !context.fetch[IS_STUBBED]
    );

    this.native = context.fetch;

    context.fetch = (url, options = {}) =>
      this.handleRequest({
        url,
        method: options.method || 'GET',
        headers: serializeHeaders(options.headers),
        body: options.body,
        requestArguments: [url, options]
      });

    defineProperty(context.fetch, IS_STUBBED, { value: true });
  }

  onDisconnect() {
    this.options.context.fetch = this.native;
    this.native = null;
  }

  async onRecord(pollyRequest) {
    const response = await this.onPassthrough(pollyRequest);

    await this.persister.recordRequest(pollyRequest);

    return response;
  }

  onReplay(pollyRequest, { statusCode, headers, body }) {
    return this.respond(pollyRequest, statusCode, headers, body);
  }

  async onPassthrough(pollyRequest) {
    const [, options] = pollyRequest.requestArguments;

    const response = await this.native.apply(global, [
      pollyRequest.url,
      {
        ...options,
        method: pollyRequest.method,
        headers: pollyRequest.headers,
        body: pollyRequest.body
      }
    ]);

    return this.respond(
      pollyRequest,
      response.status,
      serializeHeaders(response.headers),
      await response.text()
    );
  }

  onIntercept(pollyRequest, { statusCode, headers, body }) {
    return this.respond(pollyRequest, statusCode, headers, body);
  }

  async respond(pollyRequest, status, headers, body) {
    const { Response } = this.options.context;

    await pollyRequest.respond(status, headers, body);

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

    return fetchResponse;
  }
}
