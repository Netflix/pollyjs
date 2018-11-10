import isObjectLike from 'lodash-es/isObjectLike';
import stringify from 'fast-json-stable-stringify';

import parseUrl from './parse-url';
import HTTPHeaders from './http-headers';

const { keys } = Object;
const { isArray } = Array;
const { parse } = JSON;

export function method(method) {
  return (method || 'GET').toUpperCase();
}

export function url(url, config = {}) {
  const parsedUrl = parseUrl(url, true);

  // Remove any url properties that have been disabled via the config
  keys(config).forEach(key => !config[key] && parsedUrl.set(key, ''));

  // Sort Query Params
  if (isObjectLike(parsedUrl.query)) {
    parsedUrl.set('query', parse(stringify(parsedUrl.query)));
  }

  return parsedUrl.href;
}

export function headers(headers, config) {
  let normalizedHeaders = headers;

  if (isObjectLike(normalizedHeaders)) {
    normalizedHeaders = new HTTPHeaders(normalizedHeaders);

    // Filter out excluded headers
    if (isObjectLike(config) && isArray(config.exclude)) {
      config.exclude.forEach(header => (normalizedHeaders[header] = null));
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
