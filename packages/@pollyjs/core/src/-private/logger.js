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
      .on('error', (...args) => this.logError(...args))
      .on('response', (...args) => this.logRequest(...args));
  }

  disconnect() {
    this.groupEnd();
    this._middleware.off('error');
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
      console.groupEnd();
    }
  }

  logRequest(request) {
    if (request.config.logging) {
      this.groupStart(request.recordingName);

      console.groupCollapsed(
        `${FORMATTED_ACTIONS[request.action]} ➞ ${request.method} ${
          request.url
        } ${request.response.statusCode} • ${request.responseTime}ms`
      );
      console.log('Request:', request);
      console.log('Response:', request.response);
      console.log('Identifiers:', request.identifiers);
      console.groupEnd();
    }
  }

  logError(request, error) {
    this.groupStart(request.recordingName);

    console.group(`Errored ➞ ${request.method} ${request.url}`);
    console.error(error);
    console.log('Request:', request);

    if (request.didRespond) {
      console.log('Response:', request.response);
    }

    console.log('Identifiers:', request.identifiers);
    console.groupEnd();
  }
}
