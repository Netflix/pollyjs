import RouteRecognizer from 'route-recognizer';
import Route from './route';
import Handler from './handler';
import Middleware from './middleware';
import removeHostFromUrl from '../utils/remove-host-from-url';
import castArray from 'lodash-es/castArray';
import { URL, assert, timeout, buildUrl } from '@pollyjs/utils';

const HOST = Symbol();
const NAMESPACES = Symbol();
const REGISTRY = Symbol();
const MIDDLEWARE = Symbol();
const SLASH = '/';
const STAR = '*';

const METHODS = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

const { keys } = Object;

function parseUrl(url) {
  const path = new URL(url);
  /*
    Use the full origin (http://hostname:port) if the host exists. If there
    is no host, URL.origin returns "null" (null as a string) so set host to '/'
  */
  const host = path.host ? path.origin : SLASH;
  const href = removeHostFromUrl(path).href;

  return { host, path: href };
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

      registry[method.toUpperCase()].add([{ path, handler }]);
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
        (!route || route === STAR) &&
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

  _registryForHost(host) {
    host = host || SLASH;

    if (!this[REGISTRY][host]) {
      this[REGISTRY][host] = METHODS.reduce((acc, method) => {
        acc[method] = new RouteRecognizer();

        return acc;
      }, {});
    }

    return this[REGISTRY][host];
  }
}
