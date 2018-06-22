import URL from 'url-parse';
import removeHostFromUrl from './remove-host-from-url';
import isObjectLike from 'lodash-es/isObjectLike';
import isAbsoluteUrl from 'is-absolute-url';

const { keys } = Object;

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
  if (isObjectLike(config) && isObjectLike(headers) && config.exclude) {
    // Filter out excluded headers
    return keys(headers).reduce((h, k) => {
      if (!config.exclude.includes(k)) {
        h[k] = headers[k];
      }

      return h;
    }, {});
  }

  return headers;
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
