import mergeConfigs from '../utils/merge-configs';

const HANDLERS = Symbol();

function requestWithParams(req, { params }) {
  return new Proxy(req, {
    set(source, prop, value) {
      /* NOTE: IE's `Reflect.set` swallows the read-only assignment error */
      /* see: https://codepen.io/jasonmit/pen/LrmLaz */
      source[prop] = value;

      return true;
    },
    get(source, prop) {
      if (prop === 'params') {
        // Set the request's params to given route's matched params
        return { ...params };
      }

      return Reflect.get(source, prop);
    }
  });
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

    this[HANDLERS] = this._orderedHandlers();
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
      ...this[HANDLERS].map(({ handler }) => handler.get('config'))
    );
  }

  applyFiltersWithArgs(req, ...args) {
    this[HANDLERS] = this[HANDLERS].filter(({ route, handler }) =>
      [...handler.get('filters')].every(fn =>
        fn(requestWithParams(req, route), ...args)
      )
    );
  }

  /**
   * Invokes the intercept handlers defined on the routes + middleware.
   * @param {PollyRequest} req
   * @param {PollyResponse} res
   * @param {Interceptor} interceptor
   */
  async intercept(req, res, interceptor) {
    for (const { route, handler } of this[HANDLERS]) {
      if (!interceptor.shouldIntercept || interceptor.shouldStopPropagating) {
        return;
      }

      if (handler.has('intercept')) {
        await handler.get('intercept')(
          requestWithParams(req, route),
          res,
          interceptor
        );
      }
    }
  }

  /**
   * Emit an event registered on the handler + all middleware handler events
   * @param {String} eventName
   * @param {PollyRequest} req
   * @param {...args} ...args
   */
  async emit(eventName, req, ...args) {
    for (const { route, handler } of this[HANDLERS]) {
      const shouldContinue = await handler._eventEmitter.emit(
        eventName,
        requestWithParams(req, route),
        ...args
      );

      if (!shouldContinue) {
        return;
      }
    }
  }

  _orderedHandlers() {
    return [...this.middleware, this].reduce((handlers, route) => {
      handlers.push(...route.handlers.map(handler => ({ route, handler })));

      return handlers;
    }, []);
  }

  _valueFor(key) {
    let value;

    for (const { handler } of this[HANDLERS]) {
      if (handler.has(key)) {
        value = handler.get(key);
      }
    }

    return value;
  }
}
