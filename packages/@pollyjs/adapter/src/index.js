import { ACTIONS, MODES, assert } from '@pollyjs/utils';

import Interceptor from './-private/interceptor';
import isExpired from './utils/is-expired';

const REQUEST_HANDLER = Symbol();

export default class Adapter {
  constructor(polly) {
    this.polly = polly;
    this.isConnected = false;
  }

  static get type() {
    return 'adapter';
  }

  static get name() {
    assert('Must override the static `name` getter.', false);
  }

  get defaultOptions() {
    return {};
  }

  get options() {
    const { name } = this.constructor;

    return {
      ...(this.defaultOptions || {}),
      ...((this.polly.config.adapterOptions || {})[name] || {})
    };
  }

  get persister() {
    return this.polly.persister;
  }

  connect() {
    if (!this.isConnected) {
      this.onConnect();
      this.isConnected = true;
    }
  }

  disconnect() {
    if (this.isConnected) {
      this.onDisconnect();
      this.isConnected = false;
    }
  }

  shouldReRecord(pollyRequest, recordingEntry) {
    const { config } = pollyRequest;

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

  timeout(pollyRequest, { time }) {
    const { timing } = pollyRequest.config;

    if (typeof timing === 'function') {
      return timing(time);
    }
  }

  async handleRequest(request) {
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

  async [REQUEST_HANDLER](pollyRequest) {
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

  async passthrough(pollyRequest) {
    pollyRequest.action = ACTIONS.PASSTHROUGH;

    return this.onPassthrough(pollyRequest);
  }

  async intercept(pollyRequest, interceptor) {
    pollyRequest.action = ACTIONS.INTERCEPT;
    await pollyRequest._intercept(interceptor);

    if (interceptor.shouldIntercept) {
      return this.onIntercept(pollyRequest, pollyRequest.response);
    }
  }

  async record(pollyRequest) {
    pollyRequest.action = ACTIONS.RECORD;

    return this.onRecord(pollyRequest);
  }

  async replay(pollyRequest) {
    const { config } = pollyRequest;
    const recordingEntry = await this.persister.findEntry(pollyRequest);

    if (recordingEntry) {
      await pollyRequest._emit('beforeReplay', recordingEntry);

      if (this.shouldReRecord(pollyRequest, recordingEntry)) {
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
      };

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

  assert(message, ...args) {
    assert(
      `[${this.constructor.type}:${this.constructor.name}] ${message}`,
      ...args
    );
  }

  /* Required Hooks */
  onConnect() {
    this.assert('Must implement the `onConnect` hook.', false);
  }

  onDisconnect() {
    this.assert('Must implement the `onDisconnect` hook.', false);
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @returns {*}
   */
  onRecord() {
    this.assert('Must implement the `onRecord` hook.', false);
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @param {Object} normalizedResponse The normalized response generated from the recording entry
   * @param {Object} recordingEntry The entire recording entry
   * @returns {*}
   */
  onReplay() {
    this.assert('Must implement the `onReplay` hook.', false);
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @param {PollyResponse} response
   * @returns {*}
   */
  onIntercept() {
    this.assert('Must implement the `onIntercept` hook.', false);
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @returns {*}
   */
  onPassthrough() {
    this.assert('Must implement the `onPassthrough` hook.', false);
  }

  /* Other Hooks */
  /**
   * @param {PollyRequest} pollyRequest
   */
  onRequest() {}

  /**
   * @param {PollyRequest} pollyRequest
   * @param {*} result The returned result value from the request handler
   */
  onRequestFinished(pollyRequest, result) {
    pollyRequest.promise.resolve(result);
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @param {Error} error
   */
  onRequestFailed(pollyRequest, error) {
    pollyRequest.promise.reject(error);
  }
}
