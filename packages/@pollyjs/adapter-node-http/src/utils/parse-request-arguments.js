import URL from 'url';

import isObjectLike from 'lodash-es/isObjectLike';

/**
 * Parse possible arguments passed into `new http.ClientRequest`.
 *
 * @export
 * @param {string | URL} [url]
 * @param {Object} [options]
 * @param {Function} [callback]
 * @returns {Object}
 */
export default function parseRequestArguments(url, options, callback) {
  if (typeof url === 'string') {
    url = URL.parse(url);
  } else if (isObjectLike(url) && url.searchParams && url.href) {
    // url.URL instance
    url = URL.parse(url.href);
  } else {
    callback = options;
    options = url;
    url = null;
  }

  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  options = { ...(url || {}), ...(options || {}) };

  return { options, callback };
}
