import { ACTIONS } from '@pollyjs/utils';

const FORMATTED_ACTIONS = {
  [ACTIONS.RECORD]: 'Recorded',
  [ACTIONS.REPLAY]: 'Replayed',
  [ACTIONS.INTERCEPT]: 'Intercepted',
  [ACTIONS.PASSTHROUGH]: 'Passthrough'
};

export default class Logger {
  constructor(polly) {
    this.polly = polly;
    this.groupName = null;
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

  groupStart(groupName) {
    // If the provided groupName is different, end the current group so a new one
    // can be started.
    if (this.groupName && this.groupName !== groupName) {
      this.groupEnd();
      this.groupName = null;
    }

    // Create a new console group for the provided groupName if one
    // doesn't already exist.
    if (!this.groupName) {
      this.groupName = groupName;
      console.group(this.groupName);
    }
  }

  groupEnd() {
    if (this.groupName) {
      console.groupEnd(this.groupName);
    }
  }

  logRequest(request) {
    if (request.config.logging) {
      this.groupStart(request.recordingName);
      console.log(
        `${FORMATTED_ACTIONS[request.action]} ➞ ${request.method} ${
          request.url
        } ${request.response.statusCode} • ${request.responseTime}ms`,
        request
      );
    }
  }
}
