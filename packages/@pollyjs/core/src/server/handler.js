import EventEmitter from '../-private/event-emitter';

export default class Handler extends EventEmitter {
  constructor() {
    super({
      eventNames: [
        'request',
        'beforeReplay',
        'beforePersist',
        'beforeResponse',
        'response'
      ]
    });
  }
}
