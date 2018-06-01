import Handler from './handler';

async function invoke(handler, route, req, ...args) {
  if (typeof handler === 'function') {
    const params = req.params;

    // Set the request's params to given route's matched params
    req.params = route.params || {};

    const result = await handler(req, ...args);

    // Reset the params object to what it was before
    req.params = params;

    return result;
  }
}

async function trigger(route, eventName, ...args) {
  if (route.handler.hasEvent(eventName)) {
    const handlers = route.handler.get(eventName);

    for (const handler of handlers) {
      await invoke(handler, route, ...args);
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
    this.middleware = middleware || [];

    if (result) {
      this.handler = result.handler;
      this.params = { ...result.params };
      this.queryParams = recognizeResults.queryParams;
    }

    this.handler = this.handler || new Handler();
  }

  /**
   * Invokes a method registered on the handler and returns its return value.
   * @param {String} methodName
   * @param {PollyRequest} req
   * @param {...args} ...args
   * @return {*}
   */
  invoke(methodName, ...args) {
    return invoke(this.handler.get(methodName), this, ...args);
  }

  /**
   * Trigger an event registered on the handler + all middleware handler events
   * @param {String} eventName
   * @param {PollyRequest} req
   * @param {...args} ...args
   */
  async trigger() {
    const { middleware } = this;

    for (const m of middleware) {
      await trigger(m, ...arguments);
    }

    await trigger(this, ...arguments);
  }
}
