import { assert } from '@pollyjs/utils';

/**
 * Extends `function` because a transpiled Class is a function at runtime.
 */
export interface FactoryFn extends Function {
  type: string;
  name: string;
}

function keyFor(Factory: FactoryFn): string {
  return `${Factory.type}:${Factory.name}`;
}

export default class Container {
  constructor(private _registry: Map<string, FactoryFn> = new Map()) {
  }

  /**
   * Register a factory onto the container.
   */
  public register(Factory: FactoryFn): void {
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
  public unregister(keyOrFactory: string | FactoryFn): void {
    const { _registry: registry } = this;
    const key =
      typeof keyOrFactory === 'function' ? keyFor(keyOrFactory) : keyOrFactory;

    registry.delete(key);
  }

  /**
   * Lookup a factory by the given key (e.g. `adapter:fetch`)
   */
  public lookup(key: string): FactoryFn | null {
    return this._registry.get(key) || null;
  }

  /**
   * Check if a factory has been registered via a key (e.g. `adapter:fetch`)
   * or Factory class.
   */
  public has(keyOrFactory: string | FactoryFn): boolean {
    const { _registry: registry } = this;
    const key =
      typeof keyOrFactory === 'function' ? keyFor(keyOrFactory) : keyOrFactory;

    return registry.has(key);
  }
}
