import { assert } from '@pollyjs/utils';

const EVENTS = Symbol();
const EVENT_NAMES = Symbol();

function assertEventName(eventName, eventNames) {
  assert(
    `Invalid event name provided. Expected string, received: "${typeof eventName}".`,
    typeof eventName === 'string'
  );

  if (eventNames.size > 0) {
    assert(
      `Invalid event name provided: "${eventName}". Possible events: ${[
        ...eventNames
      ].join(', ')}.`,
      eventNames.has(eventName)
    );
  }
}

function assertListener(listener) {
  assert(
    `Invalid listener provided. Expected function, received: "${typeof listener}".`,
    typeof listener === 'function'
  );
}

export default class Evented {
  constructor({ eventNames = [] }) {
    this[EVENTS] = new Map();
    this[EVENT_NAMES] = new Set(eventNames);
  }

  eventNames() {
    return [...this[EVENT_NAMES]];
  }

  on(eventName, listener) {
    assertEventName(eventName, this[EVENT_NAMES]);
    assertListener(listener);

    const events = this[EVENTS];

    if (!events.has(eventName)) {
      events.set(eventName, new Set());
    }

    if (!this[EVENT_NAMES].has(eventName)) {
      this[EVENT_NAMES].add(eventName);
    }

    events.get(eventName).add(listener);

    return this;
  }

  once(eventName, listener) {
    assertListener(listener);

    this.on(eventName, async (...args) => {
      this.off(eventName, listener);
      await listener(...args);
    });

    return this;
  }

  off(eventName, listener) {
    assertEventName(eventName, this[EVENT_NAMES]);

    const events = this[EVENTS];

    if (this.hasListeners(eventName)) {
      if (typeof listener === 'function') {
        events.get(eventName).delete(listener);
      } else {
        events.get(eventName).clear(eventName);
      }
    }

    return this;
  }

  listeners(eventName) {
    return this.hasListeners(eventName) ? [...this[EVENTS].get(eventName)] : [];
  }

  hasListeners(eventName) {
    const events = this[EVENTS];

    return events.has(eventName) && events.get(eventName).size > 0;
  }

  async emit(eventName, ...args) {
    await Promise.all(
      this.listeners(eventName).map(listener => listener(...args))
    );
  }

  async emitSerial(eventName, ...args) {
    for (const listener of this.listeners(eventName)) {
      await listener(...args);
    }
  }
}
