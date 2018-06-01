import assert from '../utils/assert';
import Events from './events';

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
  on(eventName, handler) {
    assertEventName(eventName);

    assert(
      `Attempted to register ${eventName} but invalid handler provided.  Expected function, received: "${typeof handler}".`,
      typeof handler === 'function'
    );

    if (!this.has(eventName)) {
      this.set(eventName, []);
    }

    this.get(eventName).push(handler);

    return this;
  }

  off(eventName, handler) {
    assertEventName(eventName);

    if (this.hasEvent(eventName)) {
      if (typeof handler === 'function') {
        this.set(eventName, this.get(eventName).filter(l => l !== handler));
      } else {
        this.delete(eventName);
      }
    }

    return this;
  }

  hasEvent(eventName) {
    return this.has(eventName) && this.get(eventName).length > 0;
  }
}
