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

  on() {
    this._eventEmitter.on(...arguments);

    return this;
  }

  once() {
    this._eventEmitter.once(...arguments);

    return this;
  }

  off() {
    this._eventEmitter.off(...arguments);

    return this;
  }
}
