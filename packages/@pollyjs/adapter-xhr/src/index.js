import FakeXHR from 'nise/lib/fake-xhr';
import Adapter from '@pollyjs/adapter';

import resolveXhr from './utils/resolve-xhr';
import serializeResponseHeaders from './utils/serialize-response-headers';

const SEND = Symbol();
const IS_STUBBED = Symbol();

export default class XHRAdapter extends Adapter {
  static get name() {
    return 'xhr';
  }

  onConnect() {
    this.assert('XHR global not found.', FakeXHR.xhr.supportsXHR);
    this.assert(
      'Running concurrent XHR adapters is unsupported, stop any running Polly instances.',
      !global.XMLHttpRequest[IS_STUBBED]
    );

    this.native = global.XMLHttpRequest;
    this.xhr = FakeXHR.useFakeXMLHttpRequest();

    this.xhr.onCreate = xhr => {
      xhr[SEND] = xhr.send;
      xhr.send = body => {
        xhr[SEND](body);
        this.handleRequest({
          url: xhr.url,
          method: xhr.method || 'GET',
          headers: xhr.requestHeaders,
          requestArguments: { xhr },
          body
        });
      };
    };

    global.XMLHttpRequest[IS_STUBBED] = true;
  }

  onDisconnect() {
    delete global.XMLHttpRequest[IS_STUBBED];
    this.xhr.restore();
  }

  respondToRequest(pollyRequest) {
    const { xhr } = pollyRequest.requestArguments;
    const { response } = pollyRequest;

    xhr.respond(response.statusCode, response.headers, response.body);
  }

  async passthroughRequest(pollyRequest) {
    const fakeXhr = pollyRequest.requestArguments.xhr;

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

    return {
      statusCode: xhr.status,
      headers: serializeResponseHeaders(xhr.getAllResponseHeaders()),
      body: xhr.responseText
    };
  }
}
