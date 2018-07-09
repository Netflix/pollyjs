import FakeXHR from 'nise/lib/fake-xhr';
import Adapter from '@pollyjs/adapter';
import resolveXhr from './utils/resolve-xhr';
import serializeResponseHeaders from './utils/serialize-response-headers';

const SEND = Symbol();

export default class XHRAdapter extends Adapter {
  static get name() {
    return 'xhr';
  }

  onConnect() {
    this.assert('XHR global not found.', FakeXHR.xhr.supportsXHR);
    this.assert(
      'Running concurrent XHR adapters is unsupported, stop any running Polly instances.',
      global.XMLHttpRequest === FakeXHR.xhr.GlobalXMLHttpRequest
    );

    this.native = FakeXHR.xhr.GlobalXMLHttpRequest;
    this.xhr = FakeXHR.useFakeXMLHttpRequest();

    this.xhr.onCreate = xhr => {
      xhr[SEND] = xhr.send;
      xhr.send = body =>
        this.handleRequest({
          url: xhr.url,
          method: xhr.method || 'GET',
          headers: xhr.requestHeaders,
          requestArguments: [xhr, body],
          body
        });
    };
  }

  onDisconnect() {
    this.xhr.restore();
  }

  async onRecord(pollyRequest) {
    await this._passthroughRequest(pollyRequest);
    await this.persister.recordRequest(pollyRequest);
    this.respondToXhr(pollyRequest);
  }

  async onReplay(pollyRequest, { status, headers, body }) {
    await pollyRequest.respond(status, headers, body);
    this.respondToXhr(pollyRequest);
  }

  async onPassthrough(pollyRequest) {
    await this._passthroughRequest(pollyRequest);
    this.respondToXhr(pollyRequest);
  }

  async onIntercept(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);
    this.respondToXhr(pollyRequest);
  }

  respondToXhr(pollyRequest) {
    const [fakeXhr] = pollyRequest.requestArguments;
    const { body, response } = pollyRequest;

    fakeXhr[SEND](body);
    fakeXhr.respond(response.statusCode, response.headers, response.body);
  }

  async _passthroughRequest(pollyRequest) {
    const [fakeXhr] = pollyRequest.requestArguments;

    const xhr = new this.native();

    xhr.open(
      pollyRequest.method,
      pollyRequest.url,
      fakeXhr.async,
      fakeXhr.username,
      fakeXhr.password
    );

    xhr.async = fakeXhr.async;

    if (fakeXhr.async) {
      xhr.timeout = fakeXhr.timeout;
      xhr.withCredentials = fakeXhr.withCredentials;
    }

    for (const h in pollyRequest.headers) {
      xhr.setRequestHeader(h, pollyRequest.headers[h]);
    }

    await resolveXhr(xhr, pollyRequest.body);
    await pollyRequest.respond(
      xhr.status,
      serializeResponseHeaders(xhr.getAllResponseHeaders()),
      xhr.responseText
    );
  }
}
