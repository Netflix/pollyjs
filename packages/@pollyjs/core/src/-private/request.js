import md5 from 'blueimp-md5';
import URL from 'url-parse';
import stringify from 'json-stable-stringify';
import PollyResponse from './response';
import NormalizeRequest from '../utils/normalize-request';
import assert from '../utils/assert';
import timestamp from '../utils/timestamp';
import removeHostFromUrl from '../utils/remove-host-from-url';
import serializeRequestBody from '../utils/serialize-request-body';

const { keys, freeze } = Object;

const PARSED_URL = Symbol();
const ROUTE = Symbol();
const POLLY = Symbol();

export default class PollyRequest {
  constructor(polly, request) {
    assert('Url is required.', typeof request.url === 'string');
    assert('Method is required.', typeof request.method === 'string');

    this.url = request.url;
    this.method = request.method.toUpperCase();
    this.body = request.body;
    this.headers = request.headers || {};
    this.recordingName = polly.recordingName;
    this.recordingId = polly.recordingId;
    this.requestArguments = freeze(request.requestArguments || []);
    this[POLLY] = polly;

    /*
      The action taken with this request (e.g. record, replay, intercept, or passthrough)
      This will be set by the adapter.
    */
    this.action = null;

    // Lookup the associated route for this request
    this[ROUTE] = polly.server.lookup(this.method, this.url);
  }

  get url() {
    // Use .toString() to force a rebuild of the url. This guarantees that
    // Any changes to the query object get propagated.
    return this[PARSED_URL].toString();
  }

  set url(value) {
    const url = new URL(value, true);

    /*
      If the url starts with a '/', setup the parsed url to reflect just that
      by removing the host. By default URL sets the host via window.location if
      it does not exist.
    */
    if (value.startsWith('/')) {
      removeHostFromUrl(url);
    }

    this[PARSED_URL] = url;
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
    return this[ROUTE].handler.get('passthrough') === true;
  }

  get shouldIntercept() {
    return typeof this[ROUTE].handler.get('intercept') === 'function';
  }

  async setup() {
    // Trigger the `request` event
    await this._trigger('request');

    // Setup the response
    this.response = new PollyResponse();
    this.didRespond = false;

    // Serialize the body which handles FormData + Blobs/Files
    this.serializedBody = await this.serializeBody();

    // Setup this request's identifiers, id, and order
    this._identify();

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
    await this._trigger('beforeResponse', this.response);

    // End the response so it can no longer be modified
    this.response.end();

    this.responseTime =
      new Date(this.response.timestamp).getTime() -
      new Date(this.timestamp).getTime();

    this.didRespond = true;

    freeze(this);

    // Trigger the `response` event
    await this._trigger('response', this.response);
  }

  async serializeBody() {
    return serializeRequestBody(this.body);
  }

  _invoke(methodName, ...args) {
    return this[ROUTE].invoke(methodName, this, ...args);
  }

  _trigger(eventName, ...args) {
    return this[ROUTE].trigger(eventName, this, ...args);
  }

  _identify() {
    const polly = this[POLLY];
    const { _requests: requests, config } = polly;
    const { matchRequestsBy } = config;
    const identifiers = {};

    // Iterate through each normalizer
    keys(NormalizeRequest).forEach(key => {
      if (this[key] && matchRequestsBy[key]) {
        identifiers[key] = NormalizeRequest[key](
          key === 'body' ? this.serializedBody : this[key],
          matchRequestsBy[key]
        );
      }
    });

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
