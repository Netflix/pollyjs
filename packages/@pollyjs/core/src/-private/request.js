import md5 from 'blueimp-md5';
import stringify from 'fast-json-stable-stringify';
import isAbsoluteUrl from 'is-absolute-url';
import { URL, assert, timestamp } from '@pollyjs/utils';

import NormalizeRequest from '../utils/normalize-request';
import parseUrl from '../utils/parse-url';
import guidForRecording from '../utils/guid-for-recording';
import mergeConfigs from '../utils/merge-configs';
import defer from '../utils/deferred-promise';
import {
  validateRecordingName,
  validateRequestConfig
} from '../utils/validators';

import HTTPBase from './http-base';
import PollyResponse from './response';
import EventEmitter from './event-emitter';
import Interceptor from './interceptor';

const { keys, freeze } = Object;

const ROUTE = Symbol();
const POLLY = Symbol();
const PARSED_URL = Symbol();
const EVENT_EMITTER = Symbol();

const SUPPORTED_EVENTS = ['identify'];

export default class PollyRequest extends HTTPBase {
  constructor(polly, request) {
    super();

    assert('Url is required.', request.url);
    assert(
      'Method is required.',
      request.method && typeof request.method === 'string'
    );

    this.didRespond = false;
    this.aborted = false;
    this.url = request.url;
    this.method = request.method.toUpperCase();
    this.body = request.body;
    this.setHeaders(request.headers);
    this.recordingName = polly.recordingName;
    this.recordingId = polly.recordingId;
    this.requestArguments = freeze(request.requestArguments);
    this.promise = defer();
    this[POLLY] = polly;
    this[EVENT_EMITTER] = new EventEmitter({ eventNames: SUPPORTED_EVENTS });

    /*
      The action taken with this request (e.g. record, replay, intercept, or passthrough)
      This will be set by the adapter.
    */
    this.action = null;

    // Interceptor instance to be passed to each of the intercept handlers
    this._interceptor = new Interceptor();

    // Lookup the associated route for this request
    this[ROUTE] = polly.server.lookup(this.method, this.url);

    // Filter all matched route handlers by this request
    this[ROUTE].applyFiltersWithArgs(this);

    // Handle config overrides defined by the route
    this.configure(this[ROUTE].config());

    // Handle recording name override defined by the route
    const recordingName = this[ROUTE].recordingName();

    if (recordingName) {
      this.overrideRecordingName(recordingName);
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

  on(eventName, listener) {
    this[EVENT_EMITTER].on(eventName, listener);

    return this;
  }

  once(eventName, listener) {
    this[EVENT_EMITTER].once(eventName, listener);

    return this;
  }

  off(eventName, listener) {
    this[EVENT_EMITTER].off(eventName, listener);

    return this;
  }

  async init() {
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

  async respond(response) {
    const { statusCode, headers, body, isBinary = false } = response || {};

    assert(
      'Cannot respond to a request that already has a response.',
      !this.didRespond
    );

    if (this.aborted) {
      return;
    }

    // Timestamp the response
    this.response.timestamp = timestamp();

    // Set the status code
    this.response.status(statusCode);

    // Se the headers
    this.response.setHeaders(headers);

    // Set the body without modifying any headers (instead of using .send())
    this.response.body = body;

    this.response.isBinary = isBinary;

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

  abort() {
    this.aborted = true;
  }

  overrideRecordingName(recordingName) {
    validateRecordingName(recordingName);
    this.recordingName = recordingName;
    this.recordingId = guidForRecording(recordingName);
  }

  configure(config) {
    validateRequestConfig(config);
    this.config = mergeConfigs(this[POLLY].config, this.config || {}, config);
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

    this.identifiers = {};

    // Iterate through each normalizer
    keys(NormalizeRequest).forEach(key => {
      if (this[key] && matchRequestsBy[key]) {
        this.identifiers[key] = NormalizeRequest[key](
          this[key],
          matchRequestsBy[key],
          this
        );
      }
    });

    // Emit the `identify` event which adapters can use to serialize the request body
    await this[EVENT_EMITTER].emit('identify', this);

    // Freeze the identifiers so they can no longer be modified
    freeze(this.identifiers);

    // Guid is a string representation of the identifiers
    this.id = md5(stringify(this.identifiers));

    // Order is calculated on other requests with the same id and recording id
    // Only requests before this current one are taken into account.
    this.order =
      matchRequestsBy.order && !this.shouldPassthrough && !this.shouldIntercept
        ? requests
            .slice(0, requests.indexOf(this))
            .filter(r => r.id === this.id && r.recordingId === this.recordingId)
            .length
        : 0;
  }
}
