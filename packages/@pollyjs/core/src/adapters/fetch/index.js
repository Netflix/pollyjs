import Adapter from '@pollyjs/adapter';
import serializeHeaders from './utils/serialize-headers';
import URL from 'url-parse';

const nativeFetch = self.fetch;
const { defineProperty } = Object;

export default class FetchAdapter extends Adapter {
  onConnect() {
    this.assert('Fetch global not found.', nativeFetch);
    this.assert(
      'Running concurrent fetch adapters is unsupported, stop any running Polly instances.',
      self.fetch === nativeFetch
    );

    this.native = nativeFetch;
    self.fetch = (url, options = {}) =>
      this.handleRequest({
        url,
        method: options.method || 'GET',
        headers: serializeHeaders(options.headers),
        body: options.body,
        requestArguments: [url, options]
      });
  }

  onDisconnect() {
    self.fetch = nativeFetch;
  }

  async onRecord(pollyRequest) {
    const response = await this.onPassthrough(pollyRequest);

    await this.persister.recordRequest(pollyRequest);

    return response;
  }

  onReplay(pollyRequest, recordingEntry) {
    const { status, headers, body } = recordingEntry.response;

    return this.respond(pollyRequest, status, headers, body);
  }

  async onPassthrough(pollyRequest) {
    const [, options] = pollyRequest.requestArguments;

    const response = await this.native.apply(self, [
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
    await pollyRequest.respond(status, headers, body);

    const { url, response } = pollyRequest;

    const fetchResponse = new Response(response.body, {
      status: response.statusCode,
      headers: response.headers
    });

    /*
      Response does not allow `url` to be set manually (either via the
      constructor or assignment) so force the url property via `defineProperty`.
    */
    defineProperty(fetchResponse, 'url', {
      /*
        Since `url` can be a relative url and Response always has an absolute
        one, use URL to attach the host if necessary.
      */
      value: new URL(url).href
    });

    return fetchResponse;
  }

  toString() {
    return '[Adapter: Fetch]';
  }
}
