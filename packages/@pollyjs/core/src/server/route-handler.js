import Handler from './handler';
import { assert } from '@pollyjs/utils';

export default class RouteHandler extends Handler {
  constructor() {
    super(...arguments);
    this.set('passthrough', false);
  }

  intercept(fn) {
    assert(
      `Invalid intercept handler provided. Expected function, received: "${typeof fn}".`,
      typeof fn === 'function'
    );

    this.set('intercept', fn);
    this.set('passthrough', false);

    return this;
  }

  passthrough() {
    this.set('passthrough', true);
    this.delete('intercept');

    return this;
  }
}
