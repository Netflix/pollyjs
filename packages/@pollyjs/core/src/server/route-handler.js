import Handler from './handler';
import { assert } from '@pollyjs/utils';

export default class RouteHandler extends Handler {
  constructor() {
    super(...arguments);
    this._passthrough = false;
  }

  intercept(fn) {
    assert(
      `Invalid intercept handler provided. Expected function, received: "${typeof fn}".`,
      typeof fn === 'function'
    );

    this._intercept = fn;
    this._passthrough = false;

    return this;
  }

  passthrough() {
    this._passthrough = true;
    delete this._intercept;

    return this;
  }
}
