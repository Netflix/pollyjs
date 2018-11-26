import RouteRecognizer from 'route-recognizer';

import Route from './route';

const GLOBAL = '__GLOBAL__';

export default class Middleware {
  constructor({ host, paths, global, handler }) {
    this.global = Boolean(global);
    this.handler = handler;
    this.host = host;
    this.paths = this.global ? [GLOBAL] : paths;
    this._routeRecognizer = new RouteRecognizer();

    this.paths.forEach(path =>
      this._routeRecognizer.add([{ path, handler: [handler] }])
    );
  }

  match(host, path) {
    if (this.global) {
      return new Route(this._routeRecognizer.recognize(GLOBAL));
    }

    if (this.host === host) {
      const recognizeResult = this._routeRecognizer.recognize(path);

      return recognizeResult && new Route(recognizeResult);
    }
  }
}
