/**
 * Create a deferred promise with `resolve` and `reject` methods.
 *
 * @returns {Promise}
 */
export default class DeferredPromise extends Promise {
  constructor() {
    let resolve, reject;

    super((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });

    this.resolve = resolve;
    this.reject = reject;
  }
}
