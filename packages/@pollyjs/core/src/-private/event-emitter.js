import { assert } from '@pollyjs/utils';

const EVENTS = Symbol();
const EVENT_NAMES = Symbol();

function assertEventName(eventName, eventNames) {
  assert(
    `Invalid event name provided. Expected string, received: "${typeof eventName}".`,
    typeof eventName === 'string'
  );

  assert(
    `Invalid event name provided: "${eventName}". Possible events: ${[
      ...eventNames
    ].join(', ')}.`,
    eventNames.has(eventName)
  );
}

function assertListener(listener) {
  assert(
    `Invalid listener provided. Expected function, received: "${typeof listener}".`,
    typeof listener === 'function'
  );
}

export default class EventEmitter {
  /**
   * @constructor
   * @param {Object} options
   * @param {String[]} options.eventNames - Supported events
   */
  constructor({ eventNames = [] }) {
    assert(
      'An array of supported events must be provided via the `eventNames` option.',
      eventNames && eventNames.length > 0
    );

    this[EVENTS] = new Map();
    this[EVENT_NAMES] = new Set(eventNames);
  }

  /**
   * Returns an array listing the events for which the emitter has
   * registered listeners
   *
   * @returns {String[]}
   */
  eventNames() {
    const eventNames = [];

    this[EVENTS].forEach(
      (_, eventName) =>
        this.hasListeners(eventName) && eventNames.push(eventName)
    );

    return eventNames;
  }

  /**
   * Adds the `listener` function to the end of the listeners array for t
   * he event named `eventName`
   *
   * @param {String} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @returns {EventEmitter}
   */
  on(eventName, listener) {
    assertEventName(eventName, this[EVENT_NAMES]);
    assertListener(listener);

    const events = this[EVENTS];

    if (!events.has(eventName)) {
      events.set(eventName, new Set());
    }

    events.get(eventName).add(listener);

    return this;
  }

  /**
   * Adds a one-time `listener` function for the event named `eventName`.
   * The next time `eventName` is triggered, this listener is removed and
   * then invoked.
   *
   * @param {String} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @returns {EventEmitter}
   */
  once(eventName, listener) {
    assertListener(listener);

    this.on(eventName, async (...args) => {
      this.off(eventName, listener);
      await listener(...args);
    });

    return this;
  }

  /**
   * Removes the specified `listener` from the listener array for
   * the event named `eventName`. If `listener` is not provided then it removes
   * all listeners, or those of the specified `eventName`.
   *
   * @param {String} eventName - The name of the event.
   * @param {Function} [listener] - The callback function
   * @returns {EventEmitter}
   */
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

  /**
   * Returns a copy of the array of listeners for the event named `eventName`.
   *
   * @param {String} eventName - The name of the event.
   * @returns {Function[]}
   */
  listeners(eventName) {
    return this.hasListeners(eventName) ? [...this[EVENTS].get(eventName)] : [];
  }

  /**
   * Returns `true` if there are any listeners for the event named `eventName`
   * or `false` otherwise.
   *
   * @param {String} eventName - The name of the event.
   * @returns {Boolean}
   */
  hasListeners(eventName) {
    const events = this[EVENTS];

    return events.has(eventName) && events.get(eventName).size > 0;
  }

  /**
   * Asynchronously calls each of the `listeners` registered for the event named
   * `eventName`, in the order they were registered, passing the supplied
   * arguments to each.
   *
   * Returns a promise that will resolve to `true` if the event had listeners,
   * `false` otherwise.
   *
   * @async
   * @param {String} eventName - The name of the event.
   * @returns {Promise<Boolean>}
   */
  async emit(eventName, ...args) {
    if (this.hasListeners(eventName)) {
      for (const listener of this.listeners(eventName)) {
        await listener(...args);
      }

      return true;
    }

    return false;
  }

  /**
   * Asynchronously and concurrently calls each of the `listeners` registered
   * for the event named `eventName`, in the order they were registered,
   * passing the supplied arguments to each.
   *
   * Returns a promise that will resolve to `true` if the event had listeners,
   * `false` otherwise.
   *
   * @async
   * @param {String} eventName - The name of the event.
   * @returns {Promise<Boolean>}
   */
  async emitParallel(eventName, ...args) {
    if (this.hasListeners(eventName)) {
      await Promise.all(
        this.listeners(eventName).map(listener => listener(...args))
      );

      return true;
    }

    return false;
  }

  /**
   * Synchronously calls each of the `listeners` registered for the event named
   * `eventName`, in the order they were registered, passing the supplied
   * arguments to each.
   *
   * Returns `true` if the event had listeners, `false` otherwise.
   *
   * @param {String} eventName - The name of the event.
   * @returns {Boolean}
   */
  emitSync(eventName, ...args) {
    if (this.hasListeners(eventName)) {
      this.listeners(eventName).forEach(listener => listener(...args));

      return true;
    }

    return false;
  }
}
