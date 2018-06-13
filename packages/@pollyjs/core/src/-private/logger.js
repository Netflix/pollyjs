const ACTIONS = {
  record: 'Recorded',
  replay: 'Replayed',
  intercept: 'Intercepted',
  passthrough: 'Passthrough'
};

export default class Logger {
  constructor(polly) {
    this.polly = polly;
    this.recordingName = null;
  }

  get enabled() {
    return this.polly.config.logging;
  }

  connect() {
    this._middleware = this.polly.server
      .any()
      .on('response', (...args) => this.logRequest(...args));
  }

  disconnect() {
    this.groupEnd();
    this._middleware.off('response');
  }

  console(method, ...args) {
    if (this.enabled) {
      this.groupStart();
      console[method].apply(console, args);
    }
  }

  groupStart() {
    // If the recording name has changed, end the current group so a new one
    // can be started.
    if (this.recordingName && this.recordingName !== this.polly.recordingName) {
      this.groupEnd();
      this.recordingName = null;
    }

    // Create a new console group for the current recording name if one
    // doesn't already exist.
    if (!this.recordingName) {
      this.recordingName = this.polly.recordingName;
      console.group(this.recordingName);
    }
  }

  groupEnd() {
    if (this.recordingName) {
      console.groupEnd(this.recordingName);
    }
  }

  logRequest(request) {
    this.log(
      `${ACTIONS[request.action]} ➞ ${request.method} ${request.url} ${
        request.response.statusCode
      } • ${request.responseTime}ms`,
      request
    );
  }

  log() {
    this.console('log', ...arguments);
  }

  warn() {
    this.console('warn', ...arguments);
  }

  error() {
    this.console('error', ...arguments);
  }
}
