import assert from '../utils/assert';

export default class Container extends Map {
  set(name, Type) {
    assert(
      `Invalid registration name provided. Expected string, received: "${typeof name}"`,
      typeof name === 'string'
    );

    assert(
      `Attempted to register ${name} but invalid factory type provided. Expected function, received: "${typeof Type}"`,
      typeof Type === 'function'
    );

    return super.set(name, Type);
  }
}
