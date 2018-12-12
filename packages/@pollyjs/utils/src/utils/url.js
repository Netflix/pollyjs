import URLParse from 'url-parse';
import qs from 'qs';

function parseQuery(query) {
  return qs.parse(query, { plainObjects: true, ignoreQueryPrefix: true });
}

function stringifyQuery(obj) {
  return qs.stringify(obj);
}

/**
 * An extended url-parse class that uses `qs` instead of the default
 * `querystringify` to support array and nested object query param strings.
 */
export default class URL extends URLParse {
  constructor(url, parse) {
    super(url, parse ? parseQuery : false);
  }

  toString() {
    return super.toString(stringifyQuery);
  }
}
