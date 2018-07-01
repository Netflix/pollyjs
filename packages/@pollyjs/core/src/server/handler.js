import Evented from '../-private/evented';

export default class Handler extends Evented {
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
