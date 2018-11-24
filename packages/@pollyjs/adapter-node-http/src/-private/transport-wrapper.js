import http from 'http';
import NodeURL from 'url';

import isObjectLike from 'lodash-es/isObjectLike';
import { URL } from '@pollyjs/utils';

import isBinaryBuffer from '../utils/is-binary-buffer';
import isContentEncoded from '../utils/is-content-encoded';
import mergeChunks from '../utils/merge-chunks';

const LISTENERS = Symbol();
const nativeRequestMapping = new WeakMap();

const { keys } = Object;

export default class TransportWrapper {
  constructor(transport, { name, adapter }) {
    this.name = name;
    this.adapter = adapter;
    this.transport = transport;
  }

  isPatched() {
    return nativeRequestMapping.has(this.transport);
  }

  patch() {
    // make sure it's not already patched
    this.adapter.assert(
      `The ${
        this.name
      } transport has already been patched, please stop any running Polly instances`,
      !this.isPatched()
    );

    nativeRequestMapping.set(this.transport, this.transport.request);
    this.transport.request = this.createRequestWrapper();
  }

  restore() {
    this.adapter.assert(
      `Cannot restore unpatched transport ${this.name}`,
      this.isPatched()
    );

    this.transport.request = nativeRequestMapping.get(this.transport);
    nativeRequestMapping.delete(this.transport);
  }

  getBodyFromChunks(chunks, headers) {
    const { adapter } = this;

    //  If we have headers and there is content-encoding it means that
    //  the body shouldn't be merged but instead persisted as an array
    //  of hex strings so that the responses can be mocked one by one.
    if (headers && isContentEncoded(headers)) {
      const hexChunks = chunks.map(chunk => {
        if (!Buffer.isBuffer(chunk)) {
          adapter.assert(
            'content-encoded responses must all be binary buffers',
            typeof chunk === 'string'
          );
          chunk = Buffer.from(chunk);
        }

        return chunk.toString('hex');
      });

      return JSON.stringify(hexChunks);
    }

    const buffer = mergeChunks(chunks);

    // The merged buffer can be one of two things:
    //   1.  A binary buffer which then has to be recorded as a hex string.
    //   2.  A string buffer.
    return buffer.toString(isBinaryBuffer(buffer) ? 'hex' : 'utf8');
  }

  getChunksFromBody(body, headers) {
    if (!body) {
      return [];
    }

    if (Buffer.isBuffer(body)) {
      return [body];
    }

    //  If we have headers and there is content-encoding it means that
    //  the body is as an array of hex strings
    if (headers && isContentEncoded(headers)) {
      const hexChunks = JSON.parse(body);

      return hexChunks.map(chunk => Buffer.from(chunk, 'hex'));
    }

    const buffer = Buffer.from(body);

    // The body can be one of two things:
    //   1.  A hex string which then means its binary data.
    //   2.  A utf8 string which means a regular string.
    return [Buffer.from(buffer, isBinaryBuffer(buffer) ? 'hex' : 'utf8')];
  }

  async passthrough(pollyRequest) {
    const { transport } = this;
    const [, , args] = pollyRequest.requestArguments;
    const { method, headers, body: chunks } = pollyRequest;
    const nativeRequest = nativeRequestMapping.get(transport);
    let [url, options] = args;

    /**
     * args could be (url, options, callback) or (options, callback) depending
     * on nodejs version. If the `url` arguments is not a string or URL
     * instance, then use (options, callback).
     */
    if (typeof url !== 'string' || !(isObjectLike(url) && url.href)) {
      options = url;
      url = undefined;
    }

    const request = nativeRequest.call(transport, {
      ...options,
      method,
      headers: { ...headers },
      ...NodeURL.parse(pollyRequest.url)
    });

    // Write the request body
    chunks.forEach(chunk => request.write(chunk));

    const response = await new Promise(resolve => {
      request.once('response', response => resolve(response));
      request.end();
    });

    const responseBody = await new Promise(resolve => {
      const chunks = [];

      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () =>
        resolve(this.getBodyFromChunks(chunks, response.headers))
      );
    });

    return {
      headers: response.headers,
      statusCode: response.statusCode,
      body: responseBody
    };
  }

  async respond(pollyRequest) {
    const { response } = pollyRequest;
    const [, req] = pollyRequest.requestArguments;

    keys(req[LISTENERS]).forEach(eventName => {
      const listeners = req[LISTENERS][eventName];

      listeners.forEach(listener => req.on(eventName, listener));
    });

    const fakeSocket = { readable: false };
    const res = new http.IncomingMessage(fakeSocket);

    res.statusCode = response.statusCode;
    res.headers = { ...response.headers };
    res.rawHeaders = keys(res.headers).forEach(key =>
      res.rawHeaders.push(key, res.headers[key])
    );

    await new Promise(resolve => process.nextTick(resolve));

    req.emit('response', res);

    const chunks = this.getChunksFromBody(response.body, response.headers);

    setImmediate(function emitChunk() {
      const chunk = chunks.shift();

      if (chunk) {
        res.push(chunk);
        setImmediate(emitChunk);
      } else {
        res.push(null);
      }
    });

    req.emit('prefinish');
    req.emit('finish');
    req.emit('end');
  }

  createRequestWrapper() {
    const wrapper = this;
    const { adapter, transport } = wrapper;
    const nativeRequest = nativeRequestMapping.get(transport);

    return (...args) => {
      const req = nativeRequest.call(transport, ...args);
      const nativeWrite = req.write;
      const chunks = [];
      let ended = false;

      req.write = (chunk, encoding, callback) => {
        if (!req.aborted) {
          if (chunk) {
            if (!Buffer.isBuffer(chunk)) {
              chunk = Buffer.from(chunk, encoding);
            }
            chunks.push(chunk);
          }
        }

        return nativeWrite.call(req, chunk, encoding, callback);
      };

      req.end = (chunk, encoding, callback) => {
        if (req.aborted || ended) {
          return;
        }

        ended = true;

        if (typeof chunk === 'function') {
          callback = chunk;
          chunk = undefined;
        } else if (typeof encoding === 'function') {
          callback = encoding;
          encoding = undefined;
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

          // unsubscribe these listeners, so that we break the connection between caller and `req`
          // until we decide what to do in next steps
          req.removeAllListeners(eventName);

          acc[eventName] = listeners;

          return acc;
        }, {});

        const headers =
          typeof req.getHeaders === 'function'
            ? req.getHeaders()
            : req.headers || req._headers || {};
        const path = req.path;
        const method = req.method;
        const host = headers.host;
        const [hostname, port = 80] = host.split(':');

        const parsedUrl = new URL('');

        parsedUrl.set('protocol', req.agent.protocol);
        parsedUrl.set('pathname', path);
        parsedUrl.set('hostname', hostname);
        parsedUrl.set('port', port !== 80 ? port : '');

        adapter.handleRequest({
          method,
          headers,
          url: parsedUrl.href,
          body: chunks,
          requestArguments: [wrapper, req, args]
        });
      };

      return req;
    };
  }
}
