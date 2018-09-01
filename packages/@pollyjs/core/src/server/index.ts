import RouteRecognizer from 'route-recognizer';
import Route from './route';
import Handler from './handler';
import RouteHandler from './route-handler';
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
  private [HOST]: string;
  private [NAMESPACES]: string[];
  private [MIDDLEWARE]: Middleware[];
  private [REGISTRY]: {
    [host: string]: {
      [method: string]: RouteRecognizer
    }
  };

  constructor() {
    this[HOST] = '';
    this[REGISTRY] = {};
    this[NAMESPACES] = [];
    this[MIDDLEWARE] = [];
  }

  public host(path: string, callback: (server: this) => void): void {
    const host = this[HOST];

    assert(`[Server] A host cannot be specified within another host.`, !host);

    this[HOST] = path;
    callback(this);
    this[HOST] = host;
  }

  public namespace(path: string, callback: (server: this) => void): void {
    const namespaces = this[NAMESPACES];

    this[NAMESPACES] = [...namespaces, path];
    callback(this);
    this[NAMESPACES] = namespaces;
  }

  public async timeout(ms: number): Promise<void> {
    await timeout(ms);
  }

  public get(routes: string | string[]): Handler {
    return this._register('GET', routes);
  }

  public put(routes: string | string[]): Handler {
    return this._register('PUT', routes);
  }

  public post(routes: string | string[]): Handler {
    return this._register('POST', routes);
  }

  public delete(routes: string | string[]): Handler {
    return this._register('DELETE', routes);
  }

  public patch(routes: string | string[]): Handler {
    return this._register('PATCH', routes);
  }

  public head(routes: string | string[]): Handler {
    return this._register('HEAD', routes);
  }

  public options(routes: string | string[]): Handler {
    return this._register('OPTIONS', routes);
  }

  public any(routes: string | string[]): Handler {
    return this._registerMiddleware(routes);
  }

  public lookup(method: string, url: string): Route {
    return new Route(this._recognize(method, url), this._lookupMiddleware(url));
  }

  private _lookupMiddleware(url: string): Middleware[] {
    const { host, path } = parseUrl(url);

    return this[MIDDLEWARE].map(m => m.match(host, path)).filter(Boolean);
  }

  private _register(method: string, routes: string | string[]): RouteHandler {
    const handler = new RouteHandler();

    castArray(routes).forEach(route => {
      const { host, path } = parseUrl(this._buildUrl(route));
      const registry = this._registryForHost(host);

      registry[method.toUpperCase()].add([{ path, handler }]);
    });

    return handler;
  }

  private _registerMiddleware(routes: string | string[]): Handler {
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

  private _recognize(method: string, url: string): {} {
    const { host, path } = parseUrl(url);
    const registry = this._registryForHost(host);

    return registry[method.toUpperCase()].recognize(path);
  }

  private _buildUrl(path: string): string {
    return buildUrl(this[HOST], ...this[NAMESPACES], path);
  }

  private _registryForHost(host?: string): {} {
    const registry = this[REGISTRY];

    host = host || SLASH;

    if (!registry[host]) {
      registry[host] = METHODS.reduce((acc, method) => {
        acc[method] = new RouteRecognizer();

        return acc;
      }, {});
    }

    return registry[host];
  }
}
