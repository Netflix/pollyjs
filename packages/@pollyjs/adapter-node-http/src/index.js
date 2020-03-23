import http from 'http';
import https from 'https';
import { URL } from 'url';
import { Readable as ReadableStream } from 'stream';

import nock from 'nock';
import {
  normalizeClientRequestArgs,
  isUtf8Representable,
  isContentEncoded
} from 'nock/lib/common';
import Adapter from '@pollyjs/adapter';
import { HTTP_METHODS } from '@pollyjs/utils';

import getUrlFromOptions from './utils/get-url-from-options';
import mergeChunks from './utils/merge-chunks';
import urlToOptions from './utils/url-to-options';

const IS_STUBBED = Symbol();
const REQUEST_ARGUMENTS = new WeakMap();

// nock begins to intercept network requests on import which is not the
// behavior we want, so restore the original behavior right away.
nock.restore();

export default class HttpAdapter extends Adapter {
  static get id() {
    return 'node-http';
  }

  static get name() {
    // NOTE: deprecated in 4.1.0 but proxying since it's possible "core" is behind
    // and therefore still referencing `name`.  Remove in 5.0.0
    return this.id;
  }

  onConnect() {
    this.assert(
      'Running concurrent node-http adapters is unsupported, stop any running Polly instances.',
      !http.ClientRequest[IS_STUBBED]
    );
    this.assert(
      'Running nock concurrently with the node-http adapter is unsupported. Run nock.restore() before connecting to this adapter.',
      !nock.isActive()
    );

    this.NativeClientRequest = http.ClientRequest;
    this.setupNock();

    // Patch methods overridden by nock to add some missing functionality
    this.patchOverriddenMethods();
  }

  onDisconnect() {
    nock.cleanAll();
    nock.restore();
    this.NativeClientRequest = null;
  }

  setupNock() {
    const adapter = this;

    // Make sure there aren't any other interceptors defined
    nock.cleanAll();

    // Create our interceptor that will match all hosts
    const interceptor = nock(/.*/).persist();

    HTTP_METHODS.forEach(m => {
      // Add an intercept for each supported HTTP method that will match all paths
      interceptor.intercept(/.*/, m).reply(function(_, _body, respond) {
        const { req, method } = this;
        const { headers } = req;
        const parsedArguments = normalizeClientRequestArgs(
          ...REQUEST_ARGUMENTS.get(req)
        );
        const url = getUrlFromOptions(parsedArguments.options);
        const requestBodyBuffer = Buffer.concat(req.requestBodyBuffers);
        const body = isUtf8Representable(requestBodyBuffer)
          ? requestBodyBuffer.toString('utf8')
          : requestBodyBuffer;

        adapter.handleRequest({
          url,
          method,
          headers,
          body,
          requestArguments: { req, body, respond, parsedArguments }
        });
      });
    });

    // Activate nock so it can start to intercept all outgoing requests
    nock.activate();
  }

  patchOverriddenMethods() {
    const modules = { http, https };
    const { ClientRequest } = http;

    // Patch the already overridden ClientRequest class so we can get
    // access to the original arguments and use them when creating the
    // passthrough request.
    http.ClientRequest = function _ClientRequest() {
      const req = new ClientRequest(...arguments);

      REQUEST_ARGUMENTS.set(req, [...arguments]);

      return req;
    };

    // Add an IS_STUBBED boolean so we can check on onConnect if we've already
    // patched the necessary methods.
    http.ClientRequest[IS_STUBBED] = true;

    // Patch http.request, http.get, https.request, and https.get
    // to set some default values which nock doesn't properly set.
    Object.keys(modules).forEach(moduleName => {
      const module = modules[moduleName];
      const { request, get, globalAgent } = module;

      function parseArgs() {
        const args = normalizeClientRequestArgs(...arguments);

        if (moduleName === 'https') {
          args.options = {
            ...{ port: 443, protocol: 'https:', _defaultAgent: globalAgent },
            ...args.options
          };
        } else {
          args.options = {
            ...{ port: 80, protocol: 'http:' },
            ...args.options
          };
        }

        return args;
      }

      module.request = function _request() {
        const { options, callback } = parseArgs(...arguments);

        return request(options, callback);
      };

      module.get = function _get() {
        const { options, callback } = parseArgs(...arguments);

        return get(options, callback);
      };
    });
  }

  onRequest(pollyRequest) {
    const { req } = pollyRequest.requestArguments;

    if (req.aborted) {
      pollyRequest.abort();
    } else {
      req.once('abort', () => pollyRequest.abort());
    }
  }

  async passthroughRequest(pollyRequest) {
    const { parsedArguments } = pollyRequest.requestArguments;
    const { method, headers, body } = pollyRequest;
    const { options } = parsedArguments;

    const request = new this.NativeClientRequest({
      ...options,
      method,
      headers: { ...headers },
      ...urlToOptions(new URL(pollyRequest.url))
    });

    const chunks = this.getChunksFromBody(body, headers);

    const responsePromise = new Promise((resolve, reject) => {
      request.once('response', resolve);
      request.once('error', reject);
      request.once('timeout', reject);
    });

    // Write the request body
    chunks.forEach(chunk => request.write(chunk));
    request.end();

    const response = await responsePromise;
    const responseBody = await new Promise((resolve, reject) => {
      const chunks = [];

      response.on('data', chunk => chunks.push(chunk));
      response.once('end', () =>
        resolve(this.getBodyFromChunks(chunks, response.headers))
      );
      response.once('error', reject);
    });

    return {
      headers: response.headers,
      statusCode: response.statusCode,
      body: responseBody
    };
  }

  async respondToRequest(pollyRequest, error) {
    const { req, respond } = pollyRequest.requestArguments;
    const { statusCode, body, headers } = pollyRequest.response;

    if (pollyRequest.aborted) {
      // Even if the request has been aborted, we need to respond to the nock
      // request in order to resolve its awaiting promise.
      respond(null, [statusCode, undefined, headers]);

      return;
    }

    if (error) {
      // If an error was received then forward it over to nock so it can
      // correctly handle it.
      respond(error);

      return;
    }

    const chunks = this.getChunksFromBody(body, headers);
    const stream = new ReadableStream();

    // Expose the response data as a stream of chunks since
    // it could contain encoded data which is needed
    // to be pushed to the response chunk by chunk.
    chunks.forEach(chunk => stream.push(chunk));
    stream.push(null);

    // Create a promise that will resolve once the request
    // has been completed (including errored or aborted). This is needed so
    // that the deferred promise used by `polly.flush()` doesn't resolve before
    // the response was actually received.
    const requestFinishedPromise = new Promise(resolve => {
      req.once('response', resolve);
      req.once('abort', resolve);
      req.once('error', resolve);
    });

    respond(null, [statusCode, stream, headers]);

    await requestFinishedPromise;
  }

  getBodyFromChunks(chunks, headers) {
    // If content-encoding is set in the header then the body/content
    // should not be concatenated. Instead, the chunks should
    // be preserved as-is so that each chunk can be mocked individually
    if (isContentEncoded(headers)) {
      const hexChunks = chunks.map(chunk => {
        if (!Buffer.isBuffer(chunk)) {
          this.assert(
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
    return buffer.toString(isUtf8Representable(buffer) ? 'utf8' : 'hex');
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
    return [Buffer.from(buffer, isUtf8Representable(buffer) ? 'utf8' : 'hex')];
  }
}
