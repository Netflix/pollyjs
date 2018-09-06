import Interceptor from './-private/interceptor';
import isExpired from './utils/is-expired';
import { ACTIONS, MODES, assert } from '@pollyjs/utils';

interface NormalizedResponse {
  statusCode: number,
  statusText: string;
  headers: {};
  body?: string;
}

const REQUEST_HANDLER = Symbol();

export default class Adapter {
  public polly: Polly;
  public isConnected: boolean;

  constructor(polly: Polly) {
    this.polly = polly;
    this.isConnected = false;
  }

  public static get type() {
    return 'adapter';
  }

  public static get name() {
    assert('Must override the static `name` getter.', false);

    return 'base';
  }

  public get defaultOptions() {
    return {};
  }

  public get options(): {} {
    const { name } = this.constructor;

    return {
      ...(this.defaultOptions || {}),
      ...((this.polly.config.adapterOptions || {})[name] || {})
    };
  }

  public get persister() {
    return this.polly.persister;
  }

  public connect() {
    if (!this.isConnected) {
      this.onConnect();
      this.isConnected = true;
    }
  }

  public disconnect() {
    if (this.isConnected) {
      this.onDisconnect();
      this.isConnected = false;
    }
  }

  shouldReRecord(recordingEntry: Entry) {
    const { config } = this.polly;

    if (isExpired(recordingEntry.startedDateTime, config.expiresIn)) {
      if (!config.recordIfExpired) {
        console.warn(
          '[Polly] Recording for the following request has expired but `recordIfExpired` is `false`.\n' +
            `${recordingEntry.request.method} ${recordingEntry.request.url}\n`,
          recordingEntry
        );

        return false;
      }

      if (navigator && !navigator.onLine) {
        console.warn(
          '[Polly] Recording for the following request has expired but the browser is offline.\n' +
            `${recordingEntry.request.method} ${recordingEntry.request.url}\n`,
          recordingEntry
        );

        return false;
      }

      return true;
    }

    return false;
  }

  public async timeout(pollyRequest: PollyRequest, recordingEntry: Entry) {
    const { timing } = this.polly.config;

    if (typeof timing === 'function') {
      return timing(recordingEntry.time);
    }
  }

  public async handleRequest(request: {}) {
    const pollyRequest = this.polly.registerRequest(request);

    await pollyRequest.setup();
    await this.onRequest(pollyRequest);

    try {
      const result = await this[REQUEST_HANDLER](pollyRequest);

      await this.onRequestFinished(pollyRequest, result);

      return result;
    } catch (error) {
      await this.onRequestFailed(pollyRequest, error);
      throw error;
    }
  }

  public async [REQUEST_HANDLER](pollyRequest: PollyRequest) {
    const { mode } = this.polly;
    let interceptor;

    if (pollyRequest.shouldIntercept) {
      interceptor = new Interceptor();
      const response = await this.intercept(pollyRequest, interceptor);

      if (interceptor.shouldIntercept) {
        return response;
      }
    }

    if (
      mode === MODES.PASSTHROUGH ||
      pollyRequest.shouldPassthrough ||
      (interceptor && interceptor.shouldPassthrough)
    ) {
      return this.passthrough(pollyRequest);
    }

    this.assert(
      'A persister must be configured in order to record and replay requests.',
      !!this.persister
    );

    if (mode === MODES.RECORD) {
      return this.record(pollyRequest);
    }

    if (mode === MODES.REPLAY) {
      return this.replay(pollyRequest);
    }

    // This should never be reached. If it did, then something screwy happened.
    this.assert(
      `Unhandled request: ${pollyRequest.method} ${pollyRequest.url}.`,
      false
    );
  }

  public async passthrough(pollyRequest: PollyRequest) {
    pollyRequest.action = ACTIONS.PASSTHROUGH;

    return this.onPassthrough(pollyRequest);
  }

  public async intercept(pollyRequest: PollyRequest, interceptor: Interceptor) {
    pollyRequest.action = ACTIONS.INTERCEPT;
    await pollyRequest._intercept(interceptor);

    if (interceptor.shouldIntercept) {
      return this.onIntercept(pollyRequest, pollyRequest.response);
    }
  }

  public async record(pollyRequest: PollyRequest) {
    pollyRequest.action = ACTIONS.RECORD;

    return this.onRecord(pollyRequest);
  }

  public async replay(pollyRequest: PollyRequest) {
    const { config } = this.polly;
    const recordingEntry = await this.persister.findEntry(pollyRequest);

    if (recordingEntry) {
      await pollyRequest._emit('beforeReplay', recordingEntry);

      if (this.shouldReRecord(recordingEntry)) {
        return this.record(pollyRequest);
      }

      await this.timeout(pollyRequest, recordingEntry);
      pollyRequest.action = ACTIONS.REPLAY;

      const { status, statusText, headers, content } = recordingEntry.response;
      const normalizedResponse = {
        statusText,
        statusCode: status,
        headers: (headers || []).reduce((accum, { name, value }) => {
          accum[name] = value;

          return accum;
        }, {}),
        body: content && content.text
      } as NormalizedResponse;

      return this.onReplay(pollyRequest, normalizedResponse, recordingEntry);
    }

    if (config.recordIfMissing) {
      return this.record(pollyRequest);
    }

    this.assert(
      'Recording for the following request is not found and `recordIfMissing` is `false`.\n' +
        `${pollyRequest.method} ${pollyRequest.url}\n`,
      false
    );
  }

  public assert(message: string, condition?: boolean) {
    const { type, name } = this.constructor as typeof Adapter;

    assert(`[${type}:${name}] ${message}`, condition);
  }

  /* Required Hooks */
  public onConnect() {
    this.assert('Must implement the `onConnect` hook.', false);
  }

  public onDisconnect() {
    this.assert('Must implement the `onDisconnect` hook.', false);
  }

  public async onRecord(pollyRequest: PollyRequest): Promise<any> {
    this.assert('Must implement the `onRecord` hook.', false);
  }

  public onReplay(pollyRequest: PollyRequest, normalizedResponse: NormalizedResponse, recordingEntry: Entry): Promise<any> {
    this.assert('Must implement the `onReplay` hook.', false);
  }

  public async onIntercept(pollyRequest: PollyRequest, response: PollyResponse): Promise<any> {
    this.assert('Must implement the `onIntercept` hook.', false);
  }

  public async onPassthrough(pollyRequest: PollyRequest): Promise<any> {
    this.assert('Must implement the `onPassthrough` hook.', false);
  }

  /* Other Hooks */
  public async onRequest(pollyRequest: PollyRequest) {}

  async onRequestFinished(pollyRequest: PollyRequest, result: any) {
    pollyRequest.promise.resolve(result);
  }

  async onRequestFailed(pollyRequest: PollyRequest, error: any) {
    pollyRequest.promise.reject(error);
  }
}
