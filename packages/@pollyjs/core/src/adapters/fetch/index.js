import Adapter from '@pollyjs/adapter';
import serializeHeaders from './utils/serialize-headers';

const nativeFetch = self.fetch;

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
    const { status, headers, content } = recordingEntry.response;
    const headersObj = headers.reduce((accum, { name, value }) => {
      accum[name] = value;

      return accum;
    }, {});
    const body = content && content.text;

    return this.respond(pollyRequest, status, headersObj, body);
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

    const { response } = pollyRequest;

    return new Response(response.body, {
      status: response.statusCode,
      headers: response.headers
    });
  }

  toString() {
    return '[Adapter: Fetch]';
  }
}
