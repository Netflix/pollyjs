import md5 from 'blueimp-md5';
import stringify from 'fast-json-stable-stringify';
import PollyResponse from './response';
import NormalizeRequest from '../utils/normalize-request';
import parseUrl from '../utils/parse-url';
import serializeRequestBody from '../utils/serialize-request-body';
import DeferredPromise from '../utils/deferred-promise';
import isAbsoluteUrl from 'is-absolute-url';
import { URL, assert, timestamp } from '@pollyjs/utils';
import HTTPBase from './http-base';

const { keys, freeze } = Object;

const PARSED_URL = Symbol();
const ROUTE = Symbol();
const POLLY = Symbol();

export default class PollyRequest extends HTTPBase {
  public method: string;
  public body?: string;
  public serializedBody: string;
  public recordingName: string;
  public recordingId: string;
  public requestArguments: any[];
  public promise: Promise<void>;
  public action?: string;
  public timestamp: string;
  public response: PollyResponse;
  public didRespond: boolean;
  public responseTime: number;
  public id: string;
  public order: number;

  private [POLLY]: Polly;
  private [ROUTE]: Route;
  private [PARSED_URL]: URL;
  private identifiers: {};

  constructor(polly, request) {
    super();

    assert('Url is required.', typeof request.url === 'string');
    assert('Method is required.', typeof request.method === 'string');

    this.url = request.url;
    this.method = request.method.toUpperCase();
    this.body = request.body;
    this.setHeaders(request.headers);
    this.recordingName = polly.recordingName;
    this.recordingId = polly.recordingId;
    this.requestArguments = freeze(request.requestArguments || []);
    this.promise = new DeferredPromise();
    this[POLLY] = polly;

    /*
      The action taken with this request (e.g. record, replay, intercept, or passthrough)
      This will be set by the adapter.
    */
    this.action = null;

    // Lookup the associated route for this request
    this[ROUTE] = polly.server.lookup(this.method, this.url);
  }

  public get url(): string {
    // Use .toString() to force a rebuild of the url. This guarantees that
    // Any changes to the query object get propagated.
    return this[PARSED_URL].toString();
  }

  public set url(value: string) {
    this[PARSED_URL] = parseUrl(value, true);
  }

  public get absoluteUrl(): string {
    const { url } = this;

    return isAbsoluteUrl(url) ? url : new URL(url).href;
  }

  public get protocol(): string {
    return this[PARSED_URL].protocol;
  }

  public get hostname(): string {
    return this[PARSED_URL].hostname;
  }

  public get port(): string {
    return this[PARSED_URL].port;
  }

  public get origin(): string {
    return this[PARSED_URL].origin;
  }

  public get pathname(): string {
    return this[PARSED_URL].pathname;
  }

  public get query(): {} {
    return this[PARSED_URL].query;
  }

  public set query(value: {}) {
    this[PARSED_URL].set('query', value);
  }

  public get hash(): string {
    return this[PARSED_URL].hash;
  }

  public set hash(value: string) {
    this[PARSED_URL].set('hash', value);
  }

  public get shouldPassthrough(): boolean {
    return this[ROUTE].handler.get('passthrough') === true;
  }

  public get shouldIntercept(): boolean {
    return typeof this[ROUTE].handler.get('intercept') === 'function';
  }


  public async setup(): Promise<void> {
    // Trigger the `request` event
    await this._emit('request');

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

  public async respond(status?: number, headers?: {}, body?: string): Promise<void> {
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

  public async serializeBody(): Promise<string> {
    return serializeRequestBody(this.body);
  }

  public async _intercept(): Promise<void> {
    await this[ROUTE].intercept(this, this.response, ...arguments);
  }

  public async _emit(eventName: string, ...args: any[]): Promise<void> {
    await this[ROUTE].emit(eventName, this, ...args);
  }

  private _identify(): void {
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
