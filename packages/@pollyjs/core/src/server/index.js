import RouteRecognizer from 'route-recognizer';
import castArray from 'lodash-es/castArray';
import { HTTP_METHODS, URL, assert, timeout, buildUrl } from '@pollyjs/utils';

import Route from './route';
import Handler from './handler';
import Middleware from './middleware';

const HOST = Symbol();
const NAMESPACES = Symbol();
const REGISTRY = Symbol();
const MIDDLEWARE = Symbol();
const HANDLERS = Symbol();

const CHARS = {
  SLASH: '/',
  STAR: '*',
  COLON: ':'
};

const { keys } = Object;

function parseUrl(url) {
  const parsedUrl = new URL(url);
  /*
    Use the full origin (http://hostname:port) if the host exists. If there
    is no host, URL.origin returns "null" (null as a string) so set host to '/'
  */
  const host = parsedUrl.host ? parsedUrl.origin : CHARS.SLASH;
  const path = parsedUrl.pathname || CHARS.SLASH;

  return { host, path };
}

export default class Server {
  constructor() {
    this[HOST] = '';
    this[REGISTRY] = {};
    this[NAMESPACES] = [];
    this[MIDDLEWARE] = [];
  }

  host(path, callback) {
    const host = this[HOST];

    assert(`[Server] A host cannot be specified within another host.`, !host);

    this[HOST] = path;
    callback(this);
    this[HOST] = host;
  }

  namespace(path, callback) {
    const namespaces = this[NAMESPACES];

    this[NAMESPACES] = [...namespaces, path];
    callback(this);
    this[NAMESPACES] = namespaces;
  }

  timeout() {
    return timeout(...arguments);
  }

  get() {
    return this._register('GET', ...arguments);
  }

  put() {
    return this._register('PUT', ...arguments);
  }

  post() {
    return this._register('POST', ...arguments);
  }

  delete() {
    return this._register('DELETE', ...arguments);
  }

  patch() {
    return this._register('PATCH', ...arguments);
  }

  merge() {
    return this._register('MERGE', ...arguments);
  }

  head() {
    return this._register('HEAD', ...arguments);
  }

  options() {
    return this._register('OPTIONS', ...arguments);
  }

  any() {
    return this._registerMiddleware(...arguments);
  }

  lookup(method, url) {
    return new Route(this._recognize(method, url), this._lookupMiddleware(url));
  }

  _lookupMiddleware(url) {
    const { host, path } = parseUrl(url);

    return this[MIDDLEWARE].map(m => m.match(host, path)).filter(Boolean);
  }

  _register(method, routes) {
    const handler = new Handler();

    castArray(routes).forEach(route => {
      const { host, path } = parseUrl(this._buildUrl(route));
      const registry = this._registryForHost(host);
      const name = this._nameForPath(path);
      const router = registry[method.toUpperCase()];

      if (router[HANDLERS].has(name)) {
        router[HANDLERS].get(name).push(handler);
      } else {
        router[HANDLERS].set(name, [handler]);
        router.add([{ path, handler: router[HANDLERS].get(name) }]);
      }
    });

    return handler;
  }

  _registerMiddleware(routes) {
    const handler = new Handler();
    const pathsByHost = {};

    castArray(routes).forEach(route => {
      /*
        If the route is a '*' or '' and there is no host or namespace
        specified, treat the middleware as global so it will match all routes.
      */
      if (
        (!route || route === CHARS.STAR) &&
        !this[HOST] &&
        this[NAMESPACES].length === 0
      ) {
        this[MIDDLEWARE].push(new Middleware({ global: true, handler }));
      } else {
        const { host, path } = parseUrl(this._buildUrl(route));

        pathsByHost[host] = pathsByHost[host] || [];
        pathsByHost[host].push(path);
      }
    });

    keys(pathsByHost).forEach(host => {
      this[MIDDLEWARE].push(
        new Middleware({ host, paths: pathsByHost[host], handler })
      );
    });

    return handler;
  }

  _recognize(method, url) {
    const { host, path } = parseUrl(url);
    const registry = this._registryForHost(host);

    return registry[method.toUpperCase()].recognize(path);
  }

  _buildUrl(path) {
    return buildUrl(this[HOST], ...this[NAMESPACES], path);
  }

  /**
   * Converts a url path into a name used to combine route handlers by
   * normalizing dynamic and star segments
   * @param {String} path
   * @returns {String}
   */
  _nameForPath(path = '') {
    const name = path
      .split(CHARS.SLASH)
      .map(segment => {
        switch (segment.charAt(0)) {
          // If this is a dynamic segment (e.g. :id), then just return `:`
          // since /path/:id is the same as /path/:uuid
          case CHARS.COLON:
            return CHARS.COLON;
          // If this is a star segment (e.g. *path), then just return `*`
          // since /path/*path is the same as /path/*all
          case CHARS.STAR:
            return CHARS.STAR;
          default:
            return segment;
        }
      })
      .join(CHARS.SLASH);

    // Remove trailing slash, if we result with an empty string, return a slash
    return name.replace(/\/$/, '') || CHARS.SLASH;
  }

  _registryForHost(host) {
    if (!this[REGISTRY][host]) {
      this[REGISTRY][host] = HTTP_METHODS.reduce((acc, method) => {
        acc[method] = new RouteRecognizer();
        acc[method][HANDLERS] = new Map();

        return acc;
      }, {});
    }

    return this[REGISTRY][host];
  }
}
