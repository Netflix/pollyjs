import mergeOptions from 'merge-options';

import Handler from './handler';

async function invoke(fn, route, req, ...args) {
  if (typeof fn !== 'function') {
    return;
  }

  const proxyReq = new Proxy(req, {
    set(source, prop, value) {
      /* NOTE: IE's `Reflect.set` swallows the read-only assignment error */
      /* see: https://codepen.io/jasonmit/pen/LrmLaz */
      source[prop] = value;

      return true;
    },
    get(source, prop) {
      if (prop === 'params') {
        // Set the request's params to given route's matched params
        return route.params;
      }

      return Reflect.get(source, prop);
    }
  });

  return await fn(proxyReq, ...args);
}

async function emit(route, eventName, ...args) {
  const listeners = route.handler._eventEmitter.listeners(eventName);

  for (const listener of listeners) {
    await invoke(listener, route, ...args);
  }
}

export default class Route {
  /**
   *
   * @param {RecognizeResults} recognizeResults
   * @param {Array<Route>} middleware
   */
  constructor(recognizeResults, middleware) {
    const result = recognizeResults && recognizeResults[0];

    this.params = {};
    this.queryParams = {};
    this.middleware = middleware || [];

    if (result) {
      this.handler = result.handler;
      this.params = { ...result.params };
      this.queryParams = recognizeResults.queryParams;
    }

    this.handler = this.handler || new Handler();
  }

  shouldPassthrough() {
    return Boolean(this._valueFor('passthrough'));
  }

  shouldIntercept() {
    return Boolean(this._valueFor('intercept'));
  }

  recordingName() {
    return this._valueFor('recordingName') || null;
  }

  config() {
    return mergeOptions(
      ...this._orderedRoutes().map(r => r.handler.get('config'))
    );
  }

  /**
   * Invokes the intercept handlers defined on the routes + middleware.
   * @param {PollyRequest} req
   * @param {PollyResponse} res
   * @param {Interceptor} interceptor
   */
  async intercept(req, res, interceptor) {
    for (const route of this._orderedRoutes()) {
      if (route.handler.has('intercept') && interceptor.shouldIntercept) {
        await invoke(route.handler.get('intercept'), this, ...arguments);
      }
    }
  }

  /**
   * Emit an event registered on the handler + all middleware handler events
   * @param {String} eventName
   * @param {PollyRequest} req
   * @param {...args} ...args
   */
  async emit() {
    for (const m of this.middleware) {
      await emit(m, ...arguments);
    }

    await emit(this, ...arguments);
  }

  _orderedRoutes() {
    return [...this.middleware, this];
  }

  _valueFor(key) {
    let value;

    for (const route of this._orderedRoutes()) {
      if (route.handler.has(key)) {
        value = route.handler.get(key);
      }
    }

    return value;
  }
}
