import isObjectLike from 'lodash-es/isObjectLike';
import stringify from 'fast-json-stable-stringify';

import parseUrl from './parse-url';
import HTTPHeaders from './http-headers';

const { keys } = Object;
const { isArray } = Array;
const { parse } = JSON;

function isFunction(fn) {
  return typeof fn === 'function';
}

export function method(method, req, config) {
  return isFunction(config) ? config(method, req) : method.toUpperCase();
}

export function url(url, req, config = {}) {
  const parsedUrl = parseUrl(url, true);

  // Remove any url properties that have been disabled via the config
  keys(config).forEach(key => {
    if (isFunction(config[key])) {
      parsedUrl.set(key, config[key](parsedUrl[key], req));
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

export function headers(headers, req, config) {
  const normalizedHeaders = new HTTPHeaders(headers);

  if (isFunction(config)) {
    return config(normalizedHeaders, req);
  }

  if (isObjectLike(config) && isArray(config.exclude)) {
    config.exclude.forEach(header => delete normalizedHeaders[header]);
  }

  return normalizedHeaders;
}

export function body(body, req, config) {
  return isFunction(config) ? config(body, req) : body;
}

export default {
  headers,
  method,
  body,
  url
};
