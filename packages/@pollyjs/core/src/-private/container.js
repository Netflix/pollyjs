import { assert } from '@pollyjs/utils';

function keyFor(Factory) {
  return `${Factory.type}:${Factory.name}`;
}

export default class Container {
  constructor() {
    this._registry = new Map();
  }

  /**
   * Register a factory onto the container.
   *
   * @param {Function} Factory
   */
  register(Factory) {
    assert(
      `Attempted to register ${Factory} but invalid factory provided. Expected function, received: "${typeof Factory}"`,
      typeof Factory === 'function'
    );

    const { type, name } = Factory;

    assert(
      `Invalid registration name provided. Expected string, received: "${typeof name}"`,
      typeof name === 'string'
    );

    assert(
      `Invalid registration type provided. Expected string, received: "${typeof type}"`,
      typeof type === 'string'
    );

    this._registry.set(keyFor(Factory), Factory);
  }

  /**
   * Unregister a factory from the container via a key (e.g. `adapter:fetch`)
   * or Factory class.
   *
   * @param {String|Function} keyOrFactory
   */
  unregister(keyOrFactory) {
    const { _registry: registry } = this;
    const key =
      typeof keyOrFactory === 'function' ? keyFor(keyOrFactory) : keyOrFactory;

    registry.delete(key);
  }

  /**
   * Lookup a factory by the given key (e.g. `adapter:fetch`)
   *
   * @param {String} key
   * @returns {Function}
   */
  lookup(key) {
    return this._registry.get(key) || null;
  }

  /**
   * Check if a factory has been registered via a key (e.g. `adapter:fetch`)
   * or Factory class.
   *
   * @param {String|Function} keyOrFactory
   * @returns {Boolean}
   */
  has(keyOrFactory) {
    const { _registry: registry } = this;
    const key =
      typeof keyOrFactory === 'function' ? keyFor(keyOrFactory) : keyOrFactory;

    return registry.has(key);
  }
}
