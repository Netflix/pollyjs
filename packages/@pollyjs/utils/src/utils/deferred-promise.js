/**
 * Create a deferred promise with `resolve` and `reject` methods.
 *
 * @returns {Promise}
 */
export default function DeferredPromise() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  promise.resolve = resolve;
  promise.reject = reject;

  return promise;
}
