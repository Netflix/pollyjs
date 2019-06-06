import fakeXhr from 'nise/lib/fake-xhr';
import Adapter from '@pollyjs/adapter';

import resolveXhr from './utils/resolve-xhr';
import serializeResponseHeaders from './utils/serialize-response-headers';

const SEND = Symbol();
const stubbedXhrs = new WeakSet();

export default class XHRAdapter extends Adapter {
  static get name() {
    return 'xhr';
  }

  get defaultOptions() {
    return {
      context: global
    };
  }

  onConnect() {
    const { context } = this.options;
    const fakeXhrForContext = fakeXhr.fakeXMLHttpRequestFor(context);

    this.assert('XHR global not found.', fakeXhrForContext.xhr.supportsXHR);
    this.assert(
      'Running concurrent XHR adapters is unsupported, stop any running Polly instances.',
      !stubbedXhrs.has(context.XMLHttpRequest)
    );

    this.NativeXMLHttpRequest = context.XMLHttpRequest;
    this.xhr = fakeXhrForContext.useFakeXMLHttpRequest();

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

    stubbedXhrs.add(context.XMLHttpRequest);
  }

  onDisconnect() {
    const { context } = this.options;

    stubbedXhrs.delete(context.XMLHttpRequest);
    this.xhr.restore();
  }

  respondToRequest(pollyRequest, error) {
    const { xhr } = pollyRequest.requestArguments;

    if (error) {
      // If an error was received then call the `error` method on the fake XHR
      // request provided by nise which will simulate a network error on the request.
      // The onerror handler will be called and the status will be 0.
      // https://github.com/sinonjs/nise/blob/v1.4.10/lib/fake-xhr/index.js#L614-L621
      xhr.error();
    } else {
      const { response } = pollyRequest;

      xhr.respond(response.statusCode, response.headers, response.body);
    }
  }

  async passthroughRequest(pollyRequest) {
    const fakeXhr = pollyRequest.requestArguments.xhr;
    const xhr = new this.NativeXMLHttpRequest();

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
