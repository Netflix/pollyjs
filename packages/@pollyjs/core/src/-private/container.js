import { assert } from '@pollyjs/utils';

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

    this._registry.set(`${type}:${name}`, Factory);
  }

  /**
   * Unregister a factory from the container via a key (e.g. `adapter:fetch`)
   * or the Factory class.
   *
   * @param {String|Function} keyOrFactory
   */
  unregister(keyOrFactory) {
    const { _registry: registry } = this;

    // Unregister by key
    if (typeof keyOrFactory === 'string') {
      registry.delete(keyOrFactory);
    }

    // Unregister by Factory
    if (typeof keyOrFactory === 'function') {
      for (const [key, Factory] of registry.entries()) {
        if (Factory === keyOrFactory) {
          registry.delete(key);
        }
      }
    }
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
   * Check if a factory has been registered by the
   * given key (e.g. `adapter:fetch`)
   *
   * @param {String} key
   * @returns {Boolean}
   */
  has(key) {
    return this._registry.has(key);
  }
}
