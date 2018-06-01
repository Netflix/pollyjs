import assert from '../utils/assert';
import Handler from './handler';

export default class RouteHandler extends Handler {
  constructor() {
    super(...arguments);

    if (!this.has('passthrough')) {
      this.set('passthrough', false);
    }
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
