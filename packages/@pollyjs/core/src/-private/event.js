import { assert } from '@pollyjs/utils';

const STOP_PROPAGATION = Symbol();

export default class Event {
  constructor(type, props) {
    assert(
      `Invalid type provided. Expected a non-empty string, received: "${typeof type}".`,
      type && typeof type === 'string'
    );

    Object.defineProperty(this, 'type', { value: type });
    // eslint-disable-next-line no-restricted-properties
    Object.assign(this, props || {});

    this[STOP_PROPAGATION] = false;
  }

  stopPropagation() {
    this[STOP_PROPAGATION] = true;
  }

  get shouldStopPropagating() {
    return this[STOP_PROPAGATION];
  }
}
