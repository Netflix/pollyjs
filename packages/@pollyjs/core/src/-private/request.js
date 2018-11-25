import md5 from 'blueimp-md5';
import stringify from 'fast-json-stable-stringify';
import mergeOptions from 'merge-options';
import isAbsoluteUrl from 'is-absolute-url';
import { URL, assert, timestamp } from '@pollyjs/utils';

import NormalizeRequest from '../utils/normalize-request';
import parseUrl from '../utils/parse-url';
import serializeRequestBody from '../utils/serialize-request-body';
import guidForRecording from '../utils/guid-for-recording';
import defer from '../utils/deferred-promise';
import {
  validateRecordingName,
  validateRequestConfig
} from '../utils/validators';

import HTTPBase from './http-base';
import PollyResponse from './response';

const { keys, freeze } = Object;

const PARSED_URL = Symbol();
const ROUTE = Symbol();
const POLLY = Symbol();

export default class PollyRequest extends HTTPBase {
  constructor(polly, request) {
    super();

    assert('Url is required.', request.url);
    assert(
      'Method is required.',
      request.method && typeof request.method === 'string'
    );

    this.didRespond = false;
    this.url = request.url;
    this.method = request.method.toUpperCase();
    this.body = request.body;
    this.setHeaders(request.headers);
    this.recordingName = polly.recordingName;
    this.recordingId = polly.recordingId;
    this.requestArguments = freeze(request.requestArguments || []);
    this.promise = defer();
    this[POLLY] = polly;

    /*
      The action taken with this request (e.g. record, replay, intercept, or passthrough)
      This will be set by the adapter.
    */
    this.action = null;

    // Lookup the associated route for this request
    this[ROUTE] = polly.server.lookup(this.method, this.url);

    // Handle config overrides defined by the route
    this._configure(this[ROUTE].config());

    // Handle recording name override defined by the route
    const recordingName = this[ROUTE].recordingName();

    if (recordingName) {
      this._overrideRecordingName(recordingName);
    }
  }

  get url() {
    // Use .toString() to force a rebuild of the url. This guarantees that
    // Any changes to the query object get propagated.
    return this[PARSED_URL].toString();
  }

  set url(value) {
    // Make sure to coerce the value into a string as the passed value could be
    // a WHATWG's URL object.
    this[PARSED_URL] = parseUrl(`${value}`, true);
  }

  get absoluteUrl() {
    const { url } = this;

    return isAbsoluteUrl(url) ? url : new URL(url).href;
  }

  get protocol() {
    return this[PARSED_URL].protocol;
  }

  get hostname() {
    return this[PARSED_URL].hostname;
  }

  get port() {
    return this[PARSED_URL].port;
  }

  get origin() {
    return this[PARSED_URL].origin;
  }

  get pathname() {
    return this[PARSED_URL].pathname;
  }

  get query() {
    return this[PARSED_URL].query;
  }

  set query(value) {
    return this[PARSED_URL].set('query', value);
  }

  get hash() {
    return this[PARSED_URL].hash;
  }

  set hash(value) {
    return this[PARSED_URL].set('hash', value);
  }

  get shouldPassthrough() {
    return this[ROUTE].shouldPassthrough();
  }

  get shouldIntercept() {
    return this[ROUTE].shouldIntercept();
  }

  async setup() {
    // Trigger the `request` event
    await this._emit('request');

    // Setup the response
    this.response = new PollyResponse();
    this.didRespond = false;

    // Setup this request's identifiers, id, and order
    await this._identify();

    // Timestamp the request
    this.timestamp = timestamp();
  }

  async respond(status, headers, body) {
    assert(
      'Cannot respond to a request that already has a response.',
      !this.didRespond
    );

    // Timestamp the response
    this.response.timestamp = timestamp();

    // Set the status code and headers
    this.response.status(status).setHeaders(headers);

    // Set the body without modifying any headers (instead of using .send())
    this.response.body = body;

    // Trigger the `beforeResponse` event
    await this._emit('beforeResponse', this.response);

    // End the response so it can no longer be modified
    this.response.end();

    this.responseTime =
      new Date(this.response.timestamp).getTime() -
      new Date(this.timestamp).getTime();

    this.didRespond = true;

    this.end();

    // Trigger the `response` event
    await this._emit('response', this.response);
  }

  _overrideRecordingName(recordingName) {
    validateRecordingName(recordingName);
    this.recordingName = recordingName;
    this.recordingId = guidForRecording(recordingName);
  }

  _configure(config) {
    validateRequestConfig(config);
    this.config = mergeOptions(this[POLLY].config, this.config || {}, config);
  }

  _intercept() {
    return this[ROUTE].intercept(this, this.response, ...arguments);
  }

  _emit(eventName, ...args) {
    return this[ROUTE].emit(eventName, this, ...args);
  }

  async _identify() {
    const polly = this[POLLY];
    const { _requests: requests } = polly;
    const { matchRequestsBy } = this.config;
    const identifiers = {};

    // Iterate through each normalizer
    keys(NormalizeRequest).forEach(key => {
      if (this[key] && matchRequestsBy[key]) {
        identifiers[key] = NormalizeRequest[key](
          this[key],
          matchRequestsBy[key]
        );
      }
    });

    if (identifiers.body) {
      identifiers.body = await serializeRequestBody(identifiers.body);
    }

    // Store the identifiers for debugging and testing
    this.identifiers = freeze(identifiers);

    // Guid is a string representation of the identifiers
    this.id = md5(stringify(identifiers));

    // Order is calculated on other requests with the same id
    // Only requests before this current one are taken into account.
    this.order =
      matchRequestsBy.order && !this.shouldPassthrough && !this.shouldIntercept
        ? requests
            .slice(0, requests.indexOf(this))
            .filter(r => r.id === this.id).length
        : 0;
  }
}
