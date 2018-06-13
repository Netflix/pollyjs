import assert from '../utils/assert';
import Events from './events';

const EVENTS = Symbol();

function assertEventName(eventName) {
  assert(
    `Invalid event name provided. Expected string, received: "${typeof eventName}".`,
    typeof eventName === 'string'
  );

  assert(
    `Invalid event name provided: "${eventName}". Possible events: ${Events.join(
      ', '
    )}.`,
    Events.includes(eventName)
  );
}

export default class Handler extends Map {
  constructor() {
    super(...arguments);
    this.set(EVENTS, new Map());
  }

  on(eventName, handler) {
    assertEventName(eventName);

    assert(
      `Attempted to register "${eventName}" but invalid handler provided.  Expected function, received: "${typeof handler}".`,
      typeof handler === 'function'
    );

    const events = this.get(EVENTS);

    if (!events.has(eventName)) {
      events.set(eventName, []);
    }

    events.get(eventName).push(handler);

    return this;
  }

  off(eventName, handler) {
    assertEventName(eventName);

    const events = this.get(EVENTS);

    if (this._hasEventHandlers(eventName)) {
      if (typeof handler === 'function') {
        events.set(eventName, events.get(eventName).filter(h => h !== handler));
      } else {
        events.delete(eventName);
      }
    }

    return this;
  }

  _hasEventHandlers(eventName) {
    return this._getEventHandlers(eventName).length > 0;
  }

  _getEventHandlers(eventName) {
    const events = this.get(EVENTS);

    return events.has(eventName) ? events.get(eventName) : [];
  }
}
