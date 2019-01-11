import http from 'http';
import NodeUrl from 'url';

import isObjectLike from 'lodash-es/isObjectLike';
import { URL } from '@pollyjs/utils';

import isBinaryBuffer from '../utils/is-binary-buffer';
import isContentEncoded from '../utils/is-content-encoded';
import mergeChunks from '../utils/merge-chunks';

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
    this.adapter.assert(
      `The ${
        this.name
      } transport has already been patched, please stop any running Polly instances`,
      !this.isPatched()
    );

    const { transport } = this;
    const { request, get } = transport;

    // Save the native methods so we can restore them later on
    nativeRequestMapping.set(transport, { request, get });

    transport.request = this.createRequestWrapper();
    // In Node 10+, http.get no longer references http.request by the export
    // so we need to make sure we wrap it as well.
    // https://github.com/nodejs/node/blob/v10.0.0/lib/https.js#L275
    transport.get = this.createGetWrapper();
  }

  restore() {
    this.adapter.assert(
      `Cannot restore unpatched transport ${this.name}`,
      this.isPatched()
    );

    const { transport } = this;
    const { request, get } = nativeRequestMapping.get(transport);

    transport.request = request;
    transport.get = get;

    nativeRequestMapping.delete(transport);
  }

  getBodyFromChunks(chunks, headers) {
    const { adapter } = this;

    // If content-encoding is set in the header then the body/content
    // should not be concatenated. Instead, the chunks should
    // be preserved as-is so that each chunk can be mocked individually
    if (isContentEncoded(headers)) {
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
    //  1. A binary buffer which then has to be recorded as a hex string.
    //  2. A string buffer.
    return buffer.toString(isBinaryBuffer(buffer) ? 'hex' : 'utf8');
  }

  getChunksFromBody(body, headers) {
    if (!body) {
      return [];
    }

    if (Buffer.isBuffer(body)) {
      return [body];
    }

    // If content-encoding is set in the header then the body/content
    // is as an array of hex strings
    if (isContentEncoded(headers)) {
      const hexChunks = JSON.parse(body);

      return hexChunks.map(chunk => Buffer.from(chunk, 'hex'));
    }

    const buffer = Buffer.from(body);

    // The body can be one of two things:
    //  1. A hex string which then means its binary data.
    //  2. A utf8 string which means a regular string.
    return [Buffer.from(buffer, isBinaryBuffer(buffer) ? 'hex' : 'utf8')];
  }

  async passthrough(pollyRequest) {
    const { transport } = this;
    const [, , args] = pollyRequest.requestArguments;
    const { method, headers, body: chunks } = pollyRequest;
    const { request: nativeRequest } = nativeRequestMapping.get(transport);
    let [url, options] = args;

    /**
     * args could be (url, options, callback) or (options, callback) depending
     * on nodejs version. If the `url` arguments is not a string or URL
     * instance, then use (options, callback).
     */
    if (isObjectLike(url) && !url.searchParams) {
      options = url;
      url = undefined;
    }

    const request = nativeRequest.call(transport, {
      ...options,
      method,
      headers: { ...headers },
      ...NodeUrl.parse(pollyRequest.url)
    });

    const requestPromise = new Promise((resolve, reject) => {
      request.once('response', response => resolve(response));
      request.once('error', reject);
    });

    // Write the request body
    chunks.forEach(chunk => request.write(chunk));

    request.end();
    const response = await requestPromise;

    const responseBody = await new Promise((resolve, reject) => {
      const chunks = [];

      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () =>
        resolve(this.getBodyFromChunks(chunks, response.headers))
      );
      response.on('error', reject);
    });

    return {
      headers: response.headers,
      statusCode: response.statusCode,
      body: responseBody
    };
  }

  async respond(pollyRequest) {
    const { response: pollyResponse } = pollyRequest;
    const [, req] = pollyRequest.requestArguments;
    const fakeSocket = { readable: false };
    const response = new http.IncomingMessage(fakeSocket);

    response.statusCode = pollyResponse.statusCode;
    response.headers = { ...pollyResponse.headers };
    response.rawHeaders = keys(response.headers).forEach(key =>
      response.rawHeaders.push(key, response.headers[key])
    );

    await new Promise(resolve => process.nextTick(resolve));

    req.emit('response', response);

    const chunks = this.getChunksFromBody(
      pollyResponse.body,
      pollyResponse.headers
    );

    setImmediate(function emitChunk() {
      const chunk = chunks.shift();

      if (chunk) {
        response.push(chunk);
        setImmediate(emitChunk);
      } else {
        response.push(null);
      }
    });

    req.emit('prefinish');
    req.emit('finish');
    req.emit('end');
  }

  createRequestWrapper() {
    const wrapper = this;
    const { adapter, transport } = wrapper;
    const { request: nativeRequest } = nativeRequestMapping.get(transport);

    return function request(...args) {
      const req = nativeRequest.call(transport, ...args);
      const nativeWrite = req.write;
      const chunks = [];
      let ended = false;

      // Override req.write so we can save all the request body chunks
      req.write = (chunk, encoding, callback) => {
        if (!req.aborted) {
          if (chunk) {
            chunks.push(
              Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
            );
          }
        }

        return nativeWrite.call(req, chunk, encoding, callback);
      };

      // Override req.end since this actual request is just a shell that never gets sent out.
      // When we need to get actual data, a new request is made and a response
      // is faked to this req.
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

        // No need to carry callback around. This is what happens in original `end`.
        if (typeof callback === 'function') {
          req.once('finish', callback);
        }

        const headers =
          typeof req.getHeaders === 'function'
            ? req.getHeaders()
            : req.headers || req._headers || {};
        const host = headers.host;
        const [hostname, port = '80'] = host.split(':');
        const { method, path } = req;

        const parsedUrl = new URL('');

        parsedUrl.set('protocol', req.agent.protocol);
        parsedUrl.set('pathname', path);
        parsedUrl.set('hostname', hostname);
        parsedUrl.set('port', port !== '80' ? port : '');

        adapter
          .handleRequest({
            method,
            headers,
            url: parsedUrl.href,
            body: chunks,
            requestArguments: [wrapper, req, args]
          })
          .catch(e => {
            // This allows the consumer to handle the error gracefully
            req.emit('error', e);
          });
      };

      return req;
    };
  }

  createGetWrapper() {
    const { transport } = this;

    return function get(...args) {
      const req = transport.request(...args);

      req.end();

      return req;
    };
  }
}
