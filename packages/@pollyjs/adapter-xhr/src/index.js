import fakeXhr from '@offirgolan/nise/lib/fake-xhr';
import Adapter from '@pollyjs/adapter';
import { cloneArrayBuffer, isBufferUtf8Representable } from '@pollyjs/utils';
import { Buffer } from 'buffer/';
import bufferToArrayBuffer from 'to-arraybuffer';

import resolveXhr from './utils/resolve-xhr';
import serializeResponseHeaders from './utils/serialize-response-headers';

const SEND = Symbol();
const ABORT_HANDLER = Symbol();
const stubbedXhrs = new WeakSet();

const BINARY_RESPONSE_TYPES = ['arraybuffer', 'blob'];

export default class XHRAdapter extends Adapter {
  static get id() {
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

    this.xhr.onCreate = (xhr) => {
      xhr[SEND] = xhr.send;
      xhr.send = (body) => {
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

  async onFetchResponse(pollyRequest) {
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

    if (BINARY_RESPONSE_TYPES.includes(fakeXhr.responseType)) {
      xhr.responseType = 'arraybuffer';
    }

    if (fakeXhr.async) {
      xhr.timeout = fakeXhr.timeout;
      xhr.withCredentials = fakeXhr.withCredentials;
    }

    for (const h in pollyRequest.headers) {
      xhr.setRequestHeader(h, pollyRequest.headers[h]);
    }

    await resolveXhr(xhr, pollyRequest.body);

    let body = xhr.response;
    let isBinary = false;

    // responseType will either be `arraybuffer` or `text`
    if (xhr.responseType === 'arraybuffer') {
      let arrayBuffer = xhr.response;

      /*
        If the returned array buffer is not an instance of the global ArrayBuffer,
        clone it in order to pass Buffer.from's instanceof check. This can happen
        when using this adapter with a different context.

        https://github.com/feross/buffer/issues/289
      */
      if (
        arrayBuffer &&
        !(arrayBuffer instanceof ArrayBuffer) &&
        'byteLength' in arrayBuffer
      ) {
        arrayBuffer = cloneArrayBuffer(arrayBuffer);
      }

      const buffer = Buffer.from(arrayBuffer);

      isBinary = !isBufferUtf8Representable(buffer);
      body = buffer.toString(isBinary ? 'base64' : 'utf8');
    }

    return {
      statusCode: xhr.status,
      headers: serializeResponseHeaders(xhr.getAllResponseHeaders()),
      encoding: isBinary ? 'base64' : undefined,
      body
    };
  }

  onRespond(pollyRequest, error) {
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
      const { statusCode, headers, body, encoding } = pollyRequest.response;
      let responseBody = body;

      if (encoding) {
        const buffer = Buffer.from(body, encoding);

        if (BINARY_RESPONSE_TYPES.includes(xhr.responseType)) {
          responseBody = bufferToArrayBuffer(buffer);
        } else {
          responseBody = buffer.toString('utf8');
        }
      }

      xhr.respond(statusCode, headers, responseBody);
    }
  }
}
