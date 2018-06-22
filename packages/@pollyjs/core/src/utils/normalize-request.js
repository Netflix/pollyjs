import URL from 'url-parse';
import removeHostFromUrl from './remove-host-from-url';
import isObjectLike from 'lodash-es/isObjectLike';

const { keys } = Object;

function isAbsoluteUrl(url) {
  /^[a-z][a-z0-9+.-]*:/.test(url);
}

export function method(method) {
  return (method || 'GET').toUpperCase();
}

export function url(url, config = {}) {
  let isRelative = !isAbsoluteUrl(url);
  const parsedUrl = new URL(url, true);

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

  if (isRelative) {
    return removeHostFromUrl(parsedUrl);
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
