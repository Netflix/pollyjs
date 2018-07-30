import EventEmitter from '../-private/event-emitter';
import { validateRecordingName } from '../utils/validators';
import isObjectLike from 'lodash-es/isObjectLike';
import { assert } from '@pollyjs/utils';

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
    assert(
      `Invalid config provided. Expected object, received: "${typeof config}".`,
      isObjectLike(config)
    );

    // The following options cannot be overridden on a per request basis
    [
      'mode',
      'adapters',
      'adapterOptions',
      'persister',
      'persisterOptions'
    ].forEach(key =>
      assert(
        `Invalid configuration option provided. The "${key}" option cannot be overridden.`,
        !(key in config)
      )
    );

    this.set('config', config);
  }
}
