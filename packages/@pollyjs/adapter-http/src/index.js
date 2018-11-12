import http from 'http';
import https from 'https';
import zlib from 'zlib';

import Adapter from '@pollyjs/adapter';
import { URL } from '@pollyjs/utils';

const { defineProperty } = Object;

const LISTENERS = Symbol();
const END = Symbol();
const IS_STUBBED = Symbol();

const transports = {
  http,
  https
};

const getHttpResponseData = res => {
  return new Promise(resolve => {
    let stream;

    switch (res.headers['content-encoding']) {
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = res.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      default:
        stream = res;
    }

    const resBuffer = [];

    stream.on('data', chunk => {
      resBuffer.push(chunk);
    });

    stream.on('end', () => {
      const data = Buffer.concat(resBuffer).toString('utf8');

      resolve(data);
    });
  });
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

  async onRecord(pollyRequest) {
    await this.passthroughRequest(pollyRequest);
    await this.persister.recordRequest(pollyRequest);
    this.respond(pollyRequest);
  }

  async onReplay(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);

    this.respond(pollyRequest);
  }

  async onPassthrough(pollyRequest) {
    await this.passthroughRequest(pollyRequest);
    this.respond(pollyRequest);
  }

  async onIntercept(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);
    this.respond(pollyRequest);
  }

  async passthroughRequest(pollyRequest) {
    const [req] = pollyRequest.requestArguments;

    const res = await new Promise(resolve => {
      req.once('response', response => resolve(response));
      req[END].call(req);
    });

    const responseData = await getHttpResponseData(res);

    await pollyRequest.respond(res.statusCode, res.headers, responseData);
  }

  async respond(pollyRequest) {
    const [req] = pollyRequest.requestArguments;
    const { response } = pollyRequest;

    Object.keys(req[LISTENERS]).forEach(eventName => {
      const listeners = req[LISTENERS][eventName];

      listeners.forEach(listener => req.on(eventName, listener));
    });

    const msg = new http.IncomingMessage({ readable: false });

    msg.statusCode = response.statusCode;
    req.emit('response', msg);

    for (const h in response.headers) {
      msg.headers[h] = response.headers[h];
    }

    let body = response.body;

    if (typeof body === 'undefined') {
      body = [];
    }

    msg.emit('data', Buffer.from(body));
    msg.emit('end');

    req.emit('prefinish');
    req.emit('finish');
  }

  patchRequest(protocol) {
    const transport = transports[protocol];

    this.nativeRequest[protocol] = transport.request;
    transport.request = this.createRequestWrapper(protocol);
    defineProperty(transport, IS_STUBBED, {
      value: true
    });
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
      const originalWrite = req.write;

      req[END] = req.end;

      const chunks = [];

      req.write = (chunk, encoding, callback) => {
        // TODO : handle encoding
        chunks.push(chunk);

        originalWrite.call(req, chunk, encoding, callback);
      };

      req.end = (chunk, encoding, callback) => {
        if (typeof chunk === 'function') {
          callback = chunk;
          chunk = null;
        } else if (typeof encoding === 'function') {
          callback = encoding;
          encoding = null;
        }

        if (chunk) {
          req.write(chunk, encoding);
        }

        if (typeof callback === 'function') {
          // we don't call original `end` yet but no need to carry callback around when we do
          // this is what happens in original `end`
          req.once('finish', callback);
        }

        req[LISTENERS] = ['response'].reduce((acc, eventName) => {
          const listeners = req.listeners(eventName);

          // unsubscribe those listeners, so that we break the connection between caller and `req`
          // until we decide what to do in next steps
          req.removeAllListeners(eventName);

          acc[eventName] = listeners;

          return acc;
        }, {});

        const headers = req.getHeaders();
        const path = req.path;
        const method = req.method;
        const host = headers.host;

        // TODO : handle encoding
        const body = chunks.join();
        const [hostname, port = 80] = host.split(':');

        const parsedUrl = new URL('');

        parsedUrl.set('protocol', protocol);
        parsedUrl.set('pathname', path);
        parsedUrl.set('hostname', hostname);
        if (port !== 80) {
          parsedUrl.set('port', port);
        }

        const url = parsedUrl.href;

        this.handleRequest({
          url,
          method,
          headers,
          body: body.length > 0 ? body : undefined,
          requestArguments: [req]
        });
      };

      return req;
    };
  }
}
