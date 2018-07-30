import Handler from './handler';
import { assert } from '@pollyjs/utils';

export default class RouteHandler extends Handler {
  intercept(fn) {
    assert(
      `Invalid intercept handler provided. Expected function, received: "${typeof fn}".`,
      typeof fn === 'function'
    );

    this.set('intercept', fn);
    this.passthrough(false);

    return this;
  }

  passthrough() {
    super.passthrough(...arguments);

    if (this.get('passthrough')) {
      this.delete('intercept');
    }

    return this;
  }
}
