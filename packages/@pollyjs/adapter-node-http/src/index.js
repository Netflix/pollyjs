import Adapter from '@pollyjs/adapter';

import HttpWrapper from './-private/http-wrapper';

export default class HttpAdapter extends Adapter {
  static get name() {
    return 'node-http';
  }

  get defaultOptions() {
    return {
      transports: ['http', 'https']
    };
  }

  onConnect() {
    const { transports } = this.options;

    this.assert(
      'Invalid transports provided. At least one supported transport must be specified',
      transports.includes('http') || transports.includes('https')
    );

    this.httpWrapper = new HttpWrapper({
      adapter: this,
      options: this.options
    });
    this.httpWrapper.patch();
  }

  onDisconnect() {
    if (this.httpWrapper) {
      this.httpWrapper.restore();
      delete this.httpWrapper;
    }
  }

  async passthroughRequest(pollyRequest) {
    const [transportWrapper] = pollyRequest.requestArguments;

    return transportWrapper.passthrough(pollyRequest);
  }

  async respondToRequest(pollyRequest) {
    const [transportWrapper] = pollyRequest.requestArguments;

    return transportWrapper.respond(pollyRequest);
  }
}
