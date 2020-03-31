import { assert } from '@pollyjs/utils';

import EventEmitter from '../-private/event-emitter';
import cancelFnAfterNTimes from '../utils/cancel-fn-after-n-times';
import {
  validateTimesOption,
  validateRecordingName,
  validateRequestConfig
} from '../utils/validators';

export default class Handler extends Map {
  constructor() {
    super();

    this.set('config', {});
    this.set('defaultOptions', {});
    this.set('filters', new Set());

    this._eventEmitter = new EventEmitter({
      eventNames: [
        'error',
        'abort',
        'request',
        'beforeReplay',
        'beforePersist',
        'beforeResponse',
        'response'
      ]
    });
  }

  on(eventName, listener, options = {}) {
    this._eventEmitter.on(eventName, listener, {
      ...this.get('defaultOptions'),
      ...options
    });

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

  intercept(fn, options = {}) {
    assert(
      `Invalid intercept handler provided. Expected function, received: "${typeof fn}".`,
      typeof fn === 'function'
    );

    options = { ...this.get('defaultOptions'), ...options };

    if ('times' in options) {
      validateTimesOption(options.times);
      fn = cancelFnAfterNTimes(fn, options.times, () =>
        this.delete('intercept')
      );
    }

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

  filter(fn) {
    assert(
      `Invalid filter callback provided. Expected function, received: "${typeof fn}".`,
      typeof fn === 'function'
    );

    this.get('filters').add(fn);

    return this;
  }

  times(n) {
    if (!n && typeof n !== 'number') {
      delete this.get('defaultOptions').times;
    } else {
      validateTimesOption(n);
      this.get('defaultOptions').times = n;
    }

    return this;
  }
}
