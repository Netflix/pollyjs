import URL from 'url-parse';
import removeHostFromUrl from './remove-host-from-url';
import isObjectLike from 'lodash-es/isObjectLike';
import isAbsoluteUrl from 'is-absolute-url';

const { keys } = Object;
const { isArray } = Array;

export function method(method) {
  return (method || 'GET').toUpperCase();
}

export function url(url, config = {}) {
  const parsedUrl = new URL(url, true);

  // Remove the host if the url is relative
  if (!isAbsoluteUrl(url)) {
    removeHostFromUrl(parsedUrl);
  }

  // Remove any url properties that have been disabled via the config
  keys(config).forEach(key => !config[key] && parsedUrl.set(key, ''));

  // Sort Query Params
  const { query } = parsedUrl;

  if (isObjectLike(query)) {
    const sortedQuery = keys(query)
      .sort()
      .reduce((q, k) => {
        q[k] = query[k];

        return q;
      }, {});

    parsedUrl.set('query', sortedQuery);
  }

  return parsedUrl.href;
}

export function headers(headers, config) {
  let normalizedHeaders = headers;

  if (isObjectLike(normalizedHeaders)) {
    // Lower case all headers so 'content-type' will be the same as 'Content-Type'
    normalizedHeaders = keys(normalizedHeaders).reduce((accum, k) => {
      accum[k.toLowerCase()] = normalizedHeaders[k];

      return accum;
    }, {});

    // Filter out excluded headers
    if (isObjectLike(config) && isArray(config.exclude)) {
      const exclude = config.exclude.map(e => e.toLowerCase());

      normalizedHeaders = keys(normalizedHeaders).reduce((accum, k) => {
        if (!exclude.includes(k)) {
          accum[k] = normalizedHeaders[k];
        }

        return accum;
      }, {});
    }
  }

  return normalizedHeaders;
}

export function body(body) {
  return body;
}

export default {
  headers,
  method,
  body,
  url
};
