import Adapter from '@pollyjs/adapter';
import http from 'http';
import https from 'https';
import nodeUrl from 'url';
import parseRawRequest from './utils/parse-raw-request';

const { defineProperty } = Object;
const IS_STUBBED = Symbol();

const transports = {
  http,
  https
};

export default class HttpAdapter extends Adapter {
  static get name() {
    return 'http';
  }

  get defaultOptions() {
    return {};
  }

  onConnect() {
    this.nativeRequest = {};

    this.patchRequest('http');
    this.patchRequest('https');
  }

  onDisconnect() {
    this.restoreRequest('http');
    this.restoreRequest('https');

    this.nativeRequest = null;
  }

  patchRequest(protocol) {
    const transport = transports[protocol];

    this.nativeRequest[protocol] = transport.request;
    transport.request = this.createRequestWrapper(protocol);
    defineProperty(transport, IS_STUBBED, { value: true });
  }

  restoreRequest(protocol) {
    transports[protocol].request = this.nativeRequest[protocol];
  }

  createRequestWrapper(protocol) {
    const transport = transports[protocol];
    const nativeRequest = this.nativeRequest[protocol];

    return (...args) => {
      /**
       * args could be (url, options, callback) or (options, callback) depending on nodejs version
       * We don't need to wrap callback we can just emit 'response' event on ClientRequest
       * and it's more reliable to collect request information from ClientRequest instance
       * We don't need to store args
       */

      const req = nativeRequest.call(transport, ...args);
      const reqEnd = req.end;

      req.end = () => {
        const request = parseRawRequest(req.output);

        const { path, method, headers, body } = request;

        // host = 'host[:port]'
        const host = headers.Host;

        const url = nodeUrl.format({
          protocol,
          pathname: path,
          hostname: host
        });

        this.handleRequest({
          url,
          method,
          headers,
          body,
          requestArguments: [req, reqEnd]
        });
      };

      return req;
    };
  }
}
