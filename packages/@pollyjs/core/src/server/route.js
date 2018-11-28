import mergeConfigs from '../utils/merge-configs';

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
  for (const handler of route.handlers) {
    const listeners = handler._eventEmitter.listeners(eventName);

    for (const listener of listeners) {
      await invoke(listener, route, ...args);
    }
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
    this.handlers = [];
    this.middleware = middleware || [];

    if (result) {
      this.handlers = result.handler;
      this.params = { ...result.params };
      this.queryParams = recognizeResults.queryParams;
    }
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
    return mergeConfigs(
      ...this._orderedHandlers().map(handler => handler.get('config'))
    );
  }

  /**
   * Invokes the intercept handlers defined on the routes + middleware.
   * @param {PollyRequest} req
   * @param {PollyResponse} res
   * @param {Interceptor} interceptor
   */
  async intercept(req, res, interceptor) {
    for (const handler of this._orderedHandlers()) {
      if (handler.has('intercept') && interceptor.shouldIntercept) {
        await invoke(handler.get('intercept'), this, ...arguments);
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

  _orderedHandlers() {
    return [...this.middleware, this].reduce((handlers, route) => {
      handlers.push(...route.handlers);

      return handlers;
    }, []);
  }

  _valueFor(key) {
    let value;

    for (const handler of this._orderedHandlers()) {
      if (handler.has(key)) {
        value = handler.get(key);
      }
    }

    return value;
  }
}
