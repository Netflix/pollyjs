import http from 'http';
import URL from 'url';
import { Readable } from 'stream';

import Adapter from '@pollyjs/adapter';
import nock from 'nock';

import parseRequestArguments from './utils/parse-request-arguments';
import getUrlFromOptions from './utils/get-url-from-options';
import isBinaryBuffer from './utils/is-binary-buffer';
import isContentEncoded from './utils/is-content-encoded';
import mergeChunks from './utils/merge-chunks';

const METHODS = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
const IS_STUBBED = Symbol();
const ARGUMENTS = Symbol();

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
    const interceptor = nock(/.*/, {
      filteringScope: () => true
    }).persist();

    METHODS.forEach(m => {
      // Add an intercept for each supported HTTP method that will match all paths
      interceptor.intercept(/.*/, m).reply(function(_, body, respond) {
        const { req, method } = this;
        const { headers } = req;
        const parsedArguments = parseRequestArguments(...req[ARGUMENTS]);
        const url = getUrlFromOptions(parsedArguments.options);

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

    // Override the already overridden ClientRequest class so we can get
    // access to the original arguments and use them when creating the
    // passthrough request.
    const OverriddenClientRequest = http.ClientRequest;

    http.ClientRequest = function ClientRequest() {
      const req = new OverriddenClientRequest(...arguments);

      req[ARGUMENTS] = [...arguments];

      return req;
    };

    http.ClientRequest[IS_STUBBED] = true;
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
      request.once('response', response => resolve(response));
      request.once('error', reject);
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

  respondToRequest(pollyRequest) {
    const { statusCode, body, headers } = pollyRequest.response;
    const { respond } = pollyRequest.requestArguments;
    const chunks = this.getChunksFromBody(body, headers);
    const stream = new Readable();

    // Expose the respond data as a stream of chunks since
    // it could contain chunks of encoded data which is needed
    // to be pushed to the response chunk by chunk.
    chunks.forEach(chunk => stream.push(chunk));
    stream.push(null);

    respond(null, [statusCode, stream, headers]);
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
