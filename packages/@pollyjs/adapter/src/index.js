import { ACTIONS, MODES, Serializers, assert } from '@pollyjs/utils';

import Interceptor from './-private/interceptor';
import isExpired from './utils/is-expired';
import stringifyRequest from './utils/stringify-request';
import normalizeRecordedResponse from './utils/normalize-recorded-response';

const REQUEST_HANDLER = Symbol();

export default class Adapter {
  constructor(polly) {
    this.polly = polly;
    this.isConnected = false;
  }

  static get type() {
    return 'adapter';
  }

  /* eslint-disable-next-line getter-return */
  static get name() {
    assert('Must override the static `name` getter.');
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

      if ('navigator' in global && !navigator.onLine) {
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

    pollyRequest.on('identify', (...args) => this.onIdentifyRequest(...args));

    await pollyRequest.setup();
    await this.onRequest(pollyRequest);

    try {
      await this[REQUEST_HANDLER](pollyRequest);
      await this.onRequestFinished(pollyRequest);

      return pollyRequest;
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

      await this.intercept(pollyRequest, interceptor);

      if (interceptor.shouldIntercept) {
        return;
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
      'Unhandled request: \n' + stringifyRequest(pollyRequest, null, 2)
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

      return this.onReplay(
        pollyRequest,
        normalizeRecordedResponse(recordingEntry.response),
        recordingEntry
      );
    }

    if (config.recordIfMissing) {
      return this.record(pollyRequest);
    }

    this.assert(
      'Recording for the following request is not found and `recordIfMissing` is `false`.\n' +
        stringifyRequest(pollyRequest, null, 2)
    );
  }

  assert(message, ...args) {
    assert(
      `[${this.constructor.type}:${this.constructor.name}] ${message}`,
      ...args
    );
  }

  onConnect() {
    this.assert('Must implement the `onConnect` hook.');
  }

  onDisconnect() {
    this.assert('Must implement the `onDisconnect` hook.');
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @returns {{ statusCode: number, headers: Object, body: string }}
   */
  async passthroughRequest(/* pollyRequest */) {
    this.assert('Must implement the `passthroughRequest` hook.');
  }

  /**
   * Make sure the response from a Polly request is delivered to the
   * user through the adapter interface.
   *
   * Calling `pollyjs.flush()` will await this method.
   *
   * @param {PollyRequest} pollyRequest
   */
  async respondToRequest(/* pollyRequest */) {}

  /**
   * @param {PollyRequest} pollyRequest
   */
  async onRecord(pollyRequest) {
    await this.onPassthrough(pollyRequest);
    await this.persister.recordRequest(pollyRequest);
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @param {Object} normalizedResponse The normalized response generated from the recording entry
   * @param {Object} recordingEntry The entire recording entry
   */
  async onReplay(pollyRequest, normalizedResponse) {
    await pollyRequest.respond(normalizedResponse);
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @param {PollyResponse} pollyResponse
   */
  async onIntercept(pollyRequest, pollyResponse) {
    await pollyRequest.respond(pollyResponse);
  }

  /**
   * @param {PollyRequest} pollyRequest
   */
  async onPassthrough(pollyRequest) {
    const response = await this.passthroughRequest(pollyRequest);

    await pollyRequest.respond(response);
  }

  /**
   * @param {PollyRequest} pollyRequest
   */
  async onIdentifyRequest(pollyRequest) {
    const { identifiers } = pollyRequest;

    // Serialize the request body so it can be properly hashed
    for (const type of ['blob', 'formData', 'buffer']) {
      identifiers.body = await Serializers[type](identifiers.body);
    }
  }

  /**
   * @param {PollyRequest} pollyRequest
   */
  onRequest() {}

  /**
   * @param {PollyRequest} pollyRequest
   */
  async onRequestFinished(pollyRequest) {
    await this.respondToRequest(pollyRequest);

    pollyRequest.promise.resolve();
  }

  /**
   * @param {PollyRequest} pollyRequest
   * @param {Error} error
   */
  onRequestFailed(pollyRequest, error) {
    pollyRequest.promise.reject(error);
  }
}
