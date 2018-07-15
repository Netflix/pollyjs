import Adapter from '@pollyjs/adapter';
import { Fetch as FetchUtils } from '@pollyjs/utils';

const nativeFetch = global.fetch;
const { defineProperty } = Object;

export default class FetchAdapter extends Adapter {
  static get name() {
    return 'fetch';
  }

  onConnect() {
    this.assert('Fetch global not found.', nativeFetch);
    this.assert(
      'Running concurrent fetch adapters is unsupported, stop any running Polly instances.',
      global.fetch === nativeFetch
    );

    this.native = nativeFetch;
    global.fetch = (url, options = {}) =>
      this.handleRequest({
        url,
        method: options.method || 'GET',
        headers: FetchUtils.serializeHeaders(options.headers),
        body: options.body,
        requestArguments: [url, options]
      });
  }

  onDisconnect() {
    global.fetch = nativeFetch;
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
      FetchUtils.serializeHeaders(response.headers),
      await response.text()
    );
  }

  onIntercept(pollyRequest, { statusCode, headers, body }) {
    return this.respond(pollyRequest, statusCode, headers, body);
  }

  async respond(pollyRequest, status, headers, body) {
    await pollyRequest.respond(status, headers, body);

    const { absoluteUrl, response } = pollyRequest;

    const fetchResponse = new Response(response.body, {
      status: response.statusCode,
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
