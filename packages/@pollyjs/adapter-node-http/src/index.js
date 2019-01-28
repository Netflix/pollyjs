import http from 'http';
import https from 'https';
import URL from 'url';
import { Readable } from 'stream';

import nock from 'nock';
import semver from 'semver';
import Adapter from '@pollyjs/adapter';
import { HTTP_METHODS } from '@pollyjs/utils';

import parseRequestArguments from './utils/parse-request-arguments';
import getUrlFromOptions from './utils/get-url-from-options';
import isBinaryBuffer from './utils/is-binary-buffer';
import isContentEncoded from './utils/is-content-encoded';
import mergeChunks from './utils/merge-chunks';

const IS_STUBBED = Symbol();
const REQUEST_ARGUMENTS = new WeakMap();

// nock begins to intercept network requests on import which is not the
// behavior we want, so restore the original behavior right away.
nock.restore();

export default class HttpAdapter extends Adapter {
  static get name() {
    return 'node-http';
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
      interceptor.intercept(/.*/, m).reply(function(_, body, respond) {
        const { req, method } = this;
        const { headers } = req;
        const parsedArguments = parseRequestArguments(
          ...REQUEST_ARGUMENTS.get(req)
        );
        const url = getUrlFromOptions(parsedArguments.options);

        // body will always be a string unless the content-type is application/json
        // in which nock will then parse into an object. We have our own way of
        // dealing with json content to convert it back to a string.
        if (body && typeof body !== 'string') {
          body = JSON.stringify(body);
        }

        adapter
          .handleRequest({
            url,
            method,
            headers,
            body,
            requestArguments: { req, body, respond, parsedArguments }
          })
          .catch(e => {
            // This allows the consumer to handle the error gracefully
            req.emit('error', e);
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
    // to support new Node.js 10.9 signature `http.request(url[, options][, callback])`
    // (https://github.com/nock/nock/issues/1227).
    //
    // This patch is also needed to set some default values which nock doesn't
    // properly set.
    Object.keys(modules).forEach(moduleName => {
      const module = modules[moduleName];
      const { request, get, globalAgent } = module;
      const parseArgs = function() {
        const args = parseRequestArguments(...arguments);

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
      };

      module.request = function _request() {
        const { options, callback } = parseArgs(...arguments);

        return request(options, callback);
      };

      if (semver.satisfies(process.version, '>=8')) {
        module.get = function _get() {
          const { options, callback } = parseArgs(...arguments);

          return get(options, callback);
        };
      }
    });
  }

  async passthroughRequest(pollyRequest) {
    const { parsedArguments } = pollyRequest.requestArguments;
    const { method, headers, body } = pollyRequest;
    const { options } = parsedArguments;

    const request = new this.NativeClientRequest({
      ...options,
      method,
      headers: { ...headers },
      ...URL.parse(pollyRequest.url)
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

  async respondToRequest(pollyRequest) {
    const { statusCode, body, headers } = pollyRequest.response;
    const { req, respond } = pollyRequest.requestArguments;
    const chunks = this.getChunksFromBody(body, headers);
    const stream = new Readable();

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
      if (req.aborted) {
        resolve();
      } else {
        req.once('response', resolve);
        req.once('abort', resolve);
        req.once('error', resolve);
      }
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
}
