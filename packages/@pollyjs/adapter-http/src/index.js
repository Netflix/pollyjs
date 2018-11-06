import Adapter from '@pollyjs/adapter';
import http from 'http';
import https from 'https';
import nodeUrl from 'url';

const { defineProperty } = Object;

const LISTENERS = Symbol();
const END = Symbol();
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

    const responseData = await new Promise(resolve => {
      const resBuffer = [];

      res.on('data', chunk => {
        resBuffer.push(chunk);
      });

      res.on('end', () => {
        // TODO : handle encoding
        const data = Buffer.concat(resBuffer).toString('utf8');

        resolve(data);
      });
    });

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

    msg.emit('data', Buffer.from(response.body));
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
          requestArguments: [req]
        });
      };

      return req;
    };
  }
}
