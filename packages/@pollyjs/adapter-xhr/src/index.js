import fakeXhr from 'nise/lib/fake-xhr';
import Adapter from '@pollyjs/adapter';
import { Buffer } from 'buffer/';
import bufferToArrayBuffer from 'to-arraybuffer';

import resolveXhr from './utils/resolve-xhr';
import serializeResponseHeaders from './utils/serialize-response-headers';

const SEND = Symbol();
const ABORT_HANDLER = Symbol();
const stubbedXhrs = new WeakSet();

export default class XHRAdapter extends Adapter {
  static get id() {
    return 'xhr';
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

  onRequest(pollyRequest) {
    const { xhr } = pollyRequest.requestArguments;

    if (xhr.aborted) {
      pollyRequest.abort();
    } else {
      pollyRequest[ABORT_HANDLER] = () => pollyRequest.abort();
      xhr.addEventListener('abort', pollyRequest[ABORT_HANDLER]);
    }
  }

  async passthroughRequest(pollyRequest) {
    const { xhr: fakeXhr } = pollyRequest.requestArguments;
    const xhr = new this.NativeXMLHttpRequest();

    xhr.open(
      pollyRequest.method,
      pollyRequest.url,
      fakeXhr.async,
      fakeXhr.username,
      fakeXhr.password
    );

    xhr.async = fakeXhr.async;
    xhr.responseType = fakeXhr.responseType;

    if (fakeXhr.async) {
      xhr.timeout = fakeXhr.timeout;
      xhr.withCredentials = fakeXhr.withCredentials;
    }

    for (const h in pollyRequest.headers) {
      xhr.setRequestHeader(h, pollyRequest.headers[h]);
    }

    await resolveXhr(xhr, pollyRequest.body);

    const { response, responseType } = xhr;
    let body;

    if (responseType === 'arraybuffer') {
      body = Buffer.from(response).toString('hex');
    } else if (responseType === 'blob') {
      body = Buffer.from(await new Response(response).arrayBuffer()).toString(
        'hex'
      );
    } else if (responseType === 'json') {
      body = JSON.stringify(response);
    } else {
      body = `${response}`;
    }

    return {
      statusCode: xhr.status,
      headers: serializeResponseHeaders(xhr.getAllResponseHeaders()),
      isBinary: responseType === 'arraybuffer' || responseType === 'blob',
      body
    };
  }

  respondToRequest(pollyRequest, error) {
    const { xhr } = pollyRequest.requestArguments;

    if (pollyRequest[ABORT_HANDLER]) {
      xhr.removeEventListener('abort', pollyRequest[ABORT_HANDLER]);
    }

    if (pollyRequest.aborted) {
      return;
    } else if (error) {
      // If an error was received then call the `error` method on the fake XHR
      // request provided by nise which will simulate a network error on the request.
      // The onerror handler will be called and the status will be 0.
      // https://github.com/sinonjs/nise/blob/v1.4.10/lib/fake-xhr/index.js#L614-L621
      xhr.error();
    } else {
      const { responseType } = xhr;
      const { response } = pollyRequest;
      let body = response.body;

      if (responseType === 'arraybuffer') {
        body = bufferToArrayBuffer(Buffer.from(body, 'hex'));
      } else if (responseType === 'blob') {
        body = new Blob([Buffer.from(body, 'hex')], {
          type: response.getHeader('Content-Type')
        });
      }

      xhr.respond(response.statusCode, response.headers, body);
    }
  }
}
