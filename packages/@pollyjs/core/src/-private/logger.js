import { ACTIONS } from '@pollyjs/utils';
import logLevel from 'loglevel';

const FORMATTED_ACTIONS = {
  [ACTIONS.RECORD]: 'Recorded',
  [ACTIONS.REPLAY]: 'Replayed',
  [ACTIONS.INTERCEPT]: 'Intercepted',
  [ACTIONS.PASSTHROUGH]: 'Passthrough'
};

export default class Logger {
  constructor(polly) {
    this.polly = polly;
    this.log = logLevel.getLogger(`@pollyjs/core:${this.polly.recordingName}`);

    this.log.setLevel(polly.config.logLevel);
  }

  connect() {
    this._middleware = this.polly.server
      .any()
      .on('error', (...args) => this.logRequestError(...args))
      .on('request', (...args) => this.logRequest(...args))
      .on('response', (...args) => this.logRequestResponse(...args));
  }

  disconnect() {
    this._middleware.off('error');
    this._middleware.off('response');
  }

  logRequest(request) {
    const { log } = request;
    const debug = log.getLevel() <= log.levels.DEBUG;

    log.info(
      `Request: ${request.method} ${request.url}`,
      ...(debug ? [{ request }] : [])
    );
  }

  logRequestResponse(request, response) {
    const { log } = request;
    const debug = log.getLevel() <= log.levels.DEBUG;

    log.info(
      `Response: ${FORMATTED_ACTIONS[request.action]} ➞ ${request.method} ${
        request.url
      } ${response.statusCode} • ${request.responseTime}ms`,
      ...(debug ? [{ request, response }] : [])
    );
  }

  logRequestError(request, error) {
    const { log } = request;
    const debug = log.getLevel() <= log.levels.DEBUG;

    log.error(
      `Errored ➞ ${request.method} ${request.url}`,
      error,
      ...(debug ? [{ request }] : [])
    );
  }
}
