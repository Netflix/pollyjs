import { assert } from '@pollyjs/utils';

import EventEmitter from '../-private/event-emitter';
import {
  validateRecordingName,
  validateRequestConfig
} from '../utils/validators';

export default class Handler extends Map {
  constructor() {
    super();

    this.set('config', {});
    this._eventEmitter = new EventEmitter({
      eventNames: [
        'request',
        'beforeReplay',
        'beforePersist',
        'beforeResponse',
        'response'
      ]
    });
  }

  on(eventName, listener) {
    this._eventEmitter.on(eventName, listener);

    return this;
  }

  once(eventName, listener) {
    this._eventEmitter.once(eventName, listener);

    return this;
  }

  off(eventName, listener) {
    this._eventEmitter.off(eventName, listener);

    return this;
  }

  passthrough(value = true) {
    this.set('passthrough', Boolean(value));

    if (this.get('passthrough')) {
      this.delete('intercept');
    }

    return this;
  }

  intercept(fn) {
    assert(
      `Invalid intercept handler provided. Expected function, received: "${typeof fn}".`,
      typeof fn === 'function'
    );

    this.set('intercept', fn);
    this.passthrough(false);

    return this;
  }

  recordingName(recordingName) {
    if (recordingName) {
      validateRecordingName(recordingName);
    }

    this.set('recordingName', recordingName);

    return this;
  }

  configure(config) {
    validateRequestConfig(config);
    this.set('config', config);

    return this;
  }
}
