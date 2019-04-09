/**
 * Create a function that will execute the given fn and call the cancel
 * callback after being called n times.
 *
 * @export
 * @param {Function} fn
 * @param {Number} nTimes
 * @param {Function} cancel
 * @returns
 */
export default function cancelFnAfterNTimes(fn, nTimes, cancel) {
  let callCount = 0;

  return function(...args) {
    if (++callCount >= nTimes) {
      cancel();
    }

    return fn(...args);
  };
}
