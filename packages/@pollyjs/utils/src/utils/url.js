import URLParse from 'url-parse';
import qs from 'qs';

const ARRAY_FORMAT = Symbol();
const INDICES_REGEX = /\[\d+\]$/;
const BRACKETS_REGEX = /\[\]$/;

function parseQuery(query, options) {
  return qs.parse(query, {
    plainObjects: true,
    ignoreQueryPrefix: true,
    strictNullHandling: true,
    ...options
  });
}

function stringifyQuery(obj, options = {}) {
  return qs.stringify(obj, {
    addQueryPrefix: true,
    strictNullHandling: true,
    ...options
  });
}

/**
 * Given a query string, determine the array format used. Returns `undefined`
 * if one cannot be determined.
 *
 * @param {String} query
 * @returns {String | undefined}
 */
function arrayFormat(query) {
  const keys = (query || '')
    .replace('?', '')
    .split('&')
    .map(str => decodeURIComponent(str.split('=')[0]));

  for (const key of keys) {
    if (INDICES_REGEX.test(key)) {
      // a[0]=b&a[1]=c
      return 'indices';
    } else if (BRACKETS_REGEX.test(key)) {
      // a[]=b&a[]=c
      return 'brackets';
    }
  }

  // Look to see if any key has a duplicate
  const hasDuplicate = keys.some((key, index) => keys.indexOf(key) !== index);

  if (hasDuplicate) {
    // 'a=b&a=c'
    return 'repeat';
  }
}

/**
 * An extended url-parse class that uses `qs` instead of the default
 * `querystringify` to support array and nested object query param strings.
 */
export default class URL extends URLParse {
  constructor(url, parse) {
    // Construct the url with an un-parsed querystring
    super(url);

    if (parse) {
      // If we want the querystring to be parsed, use this.set('query', query)
      // as it will always parse the string. If there is no initial querystring
      // pass an object which will act as the parsed query.
      this.set('query', this.query || {});
    }
  }

  /**
   * Override set for `query` so we can pass it our custom parser.
   * https://github.com/unshiftio/url-parse/blob/1.4.4/index.js#L314-L316
   *
   * @override
   */
  set(part, value, fn) {
    if (part === 'query') {
      if (value && typeof value === 'string') {
        // Save the array format used so when we stringify it,
        // we can use the correct format.
        this[ARRAY_FORMAT] = arrayFormat(value) || this[ARRAY_FORMAT];
      }

      return super.set(part, value, parseQuery);
    }

    return super.set(part, value, fn);
  }

  /**
   * Override toString so we can pass it our custom query stringify method.
   * https://github.com/unshiftio/url-parse/blob/1.4.4/index.js#L414
   *
   * @override
   */
  toString() {
    return super.toString(obj =>
      stringifyQuery(obj, { arrayFormat: this[ARRAY_FORMAT] })
    );
  }
}
