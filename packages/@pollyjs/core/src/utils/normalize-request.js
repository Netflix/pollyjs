import isObjectLike from 'lodash-es/isObjectLike';
import isFunction from 'lodash-es/isFunction';
import stringify from 'fast-json-stable-stringify';

import parseUrl from './parse-url';
import HTTPHeaders from './http-headers';

const { keys } = Object;
const { isArray } = Array;
const { parse } = JSON;

export function method(method, config) {
  return isFunction(config)
    ? config(method || 'GET')
    : (method || 'GET').toUpperCase();
}

export function url(url, config = {}) {
  const parsedUrl = parseUrl(url, true);

  // Remove any url properties that have been disabled via the config
  keys(config).forEach(key => {
    if (isFunction(config[key])) {
      parsedUrl.set(key, config[key](parsedUrl[key]));
    } else if (!config[key]) {
      parsedUrl.set(key, '');
    }
  });

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
  }

  if (isFunction(config)) {
    normalizedHeaders = config(normalizedHeaders);
  } else if (
    isObjectLike(normalizedHeaders) &&
    isObjectLike(config) &&
    isArray(config.exclude)
  ) {
    config.exclude.forEach(header => delete normalizedHeaders[header]);
  }

  return normalizedHeaders;
}

export function body(body, config) {
  return isFunction(config) ? config(body) : body;
}

export default {
  headers,
  method,
  body,
  url
};
