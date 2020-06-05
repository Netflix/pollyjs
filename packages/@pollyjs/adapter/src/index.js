import {
  ACTIONS,
  MODES,
  EXPIRY_STRATEGIES,
  PollyError,
  Serializers,
  assert
} from '@pollyjs/utils';

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
  static get id() {
    assert('Must override the static `id` getter.');
  }

  get defaultOptions() {
    return {};
  }

  get options() {
    return {
      ...(this.defaultOptions || {}),
      ...((this.polly.config.adapterOptions || {})[this.constructor.id] || {})
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

  timeout(pollyRequest, { time }) {
    const { timing } = pollyRequest.config;

    if (typeof timing === 'function') {
      return timing(time);
    }
  }

  async handleRequest(request) {
    const pollyRequest = this.polly.registerRequest(request);

    try {
      pollyRequest.on('identify', (...args) => this.onIdentifyRequest(...args));

      await this.onRequest(pollyRequest);
      await pollyRequest.init();
      await this[REQUEST_HANDLER](pollyRequest);

      if (pollyRequest.aborted) {
        throw new PollyError('Request aborted.');
      }

      await this.onRequestFinished(pollyRequest);
    } catch (error) {
      await this.onRequestFailed(pollyRequest, error);
    }

    return pollyRequest;
  }

  async [REQUEST_HANDLER](pollyRequest) {
    const { mode } = this.polly;
    const { _interceptor: interceptor } = pollyRequest;

    if (pollyRequest.aborted) {
      return;
    }

    if (pollyRequest.shouldIntercept) {
      await this.intercept(pollyRequest, interceptor);

      if (interceptor.shouldIntercept) {
        return;
      }
    }

    if (
      mode === MODES.PASSTHROUGH ||
      pollyRequest.shouldPassthrough ||
      interceptor.shouldPassthrough
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

    if ('navigator' in global && !navigator.onLine) {
      console.warn(
        '[Polly] Recording may fail because the browser is offline.\n' +
          `${stringifyRequest(pollyRequest)}`
      );
    }

    return this.onRecord(pollyRequest);
  }

  async replay(pollyRequest) {
    const { config } = pollyRequest;
    const recordingEntry = await this.persister.findEntry(pollyRequest);

    if (recordingEntry) {
      /*
        Clone the recording entry so any changes will not actually persist to
        the stored recording.

        Note: Using JSON.parse/stringify instead of lodash/cloneDeep since
              the recording entry is stored as json.
      */
      const clonedRecordingEntry = JSON.parse(JSON.stringify(recordingEntry));

      await pollyRequest._emit('beforeReplay', clonedRecordingEntry);

      if (isExpired(clonedRecordingEntry.startedDateTime, config.expiresIn)) {
        const message =
          'Recording for the following request has expired.\n' +
          `${stringifyRequest(pollyRequest, null, 2)}`;

        switch (config.expiryStrategy) {
          // exit into the record flow if expiryStrategy is "record".
          case EXPIRY_STRATEGIES.RECORD:
            return this.record(pollyRequest);
          // throw an error and exit if expiryStrategy is "error".
          case EXPIRY_STRATEGIES.ERROR:
            this.assert(message);
            break;
          // log a warning and continue if expiryStrategy is "warn".
          case EXPIRY_STRATEGIES.WARN:
            console.warn(`[Polly] ${message}`);
            break;
          // throw an error if we encounter an unsupported expiryStrategy.
          default:
            this.assert(
              `Invalid config option passed for "expiryStrategy": "${config.expiryStrategy}"`
            );
            break;
        }
      }

      await this.timeout(pollyRequest, clonedRecordingEntry);
      pollyRequest.action = ACTIONS.REPLAY;

      return this.onReplay(
        pollyRequest,
        normalizeRecordedResponse(clonedRecordingEntry.response),
        clonedRecordingEntry
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
      `[${this.constructor.type}:${this.constructor.id}] ${message}`,
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
   * @returns {Object({ statusCode: number, headers: Object, body: string })}
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
   * @param {Error} [error]
   */
  async respondToRequest(/* pollyRequest, error */) {}

  /**
   * @param {PollyRequest} pollyRequest
   */
  async onRecord(pollyRequest) {
    await this.onPassthrough(pollyRequest);

    if (!pollyRequest.aborted) {
      await this.persister.recordRequest(pollyRequest);
    }
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
   * @param {Error} [error]
   */
  async onRequestFailed(pollyRequest, error) {
    const { aborted } = pollyRequest;

    error = error || new PollyError('Request failed due to an unknown error.');

    try {
      if (aborted) {
        await pollyRequest._emit('abort');
      } else {
        await pollyRequest._emit('error', error);
      }

      await this.respondToRequest(pollyRequest, error);
    } catch (e) {
      // Rethrow any error not handled by `respondToRequest`.
      throw e;
    } finally {
      pollyRequest.promise.reject(error);
    }
  }
}
