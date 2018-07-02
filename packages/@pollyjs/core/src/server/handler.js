import EventEmitter from '../-private/event-emitter';

export default class Handler extends Map {
  constructor() {
    super();
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
}
