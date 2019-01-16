/**
 * Create a deferred promise with `resolve` and `reject` methods.
 */
export default function defer() {
  let _resolve;
  let _reject;

  const promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  // Prevent unhandled rejection warnings
  promise.catch(() => {});

  promise.resolve = _resolve;
  promise.reject = _reject;

  return promise;
}
