import { assert } from '@pollyjs/utils';

function keyFor(Factory: any): string {
  return `${Factory.type}:${Factory.name}`;
}

export default class Container {
  private _registry: Map<String, any>;

  constructor() {
    this._registry = new Map();
  }

  /**
   * Register a factory onto the container.
   */
  public register(Factory: any): void {
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
   */
  public unregister(keyOrFactory: string | Function): void {
    const { _registry: registry } = this;
    const key =
      typeof keyOrFactory === 'function' ? keyFor(keyOrFactory) : keyOrFactory;

    registry.delete(key);
  }

  /**
   * Lookup a factory by the given key (e.g. `adapter:fetch`)
   */
  public lookup(key: string): Function | null {
    return this._registry.get(key) || null;
  }

  /**
   * Check if a factory has been registered via a key (e.g. `adapter:fetch`)
   * or Factory class.
   */
  public has(keyOrFactory: string | Function): boolean {
    const { _registry: registry } = this;
    const key =
      typeof keyOrFactory === 'function' ? keyFor(keyOrFactory) : keyOrFactory;

    return registry.has(key);
  }
}
