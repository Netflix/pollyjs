import Adapter from '@pollyjs/adapter';

import HttpWrapper from './utils/http-wrapper';

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

  async onRecord(pollyRequest) {
    await this.passthroughRequest(pollyRequest);
    await this.persister.recordRequest(pollyRequest);
    await this.respond(pollyRequest);
  }

  async onReplay(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);

    await this.respond(pollyRequest);
  }

  async onPassthrough(pollyRequest) {
    await this.passthroughRequest(pollyRequest);
    await this.respond(pollyRequest);
  }

  async onIntercept(pollyRequest, { statusCode, headers, body }) {
    await pollyRequest.respond(statusCode, headers, body);
    await this.respond(pollyRequest);
  }

  async passthroughRequest(pollyRequest) {
    const [transportWrapper, req] = pollyRequest.requestArguments;

    const res = await transportWrapper.passthrough(req);

    await pollyRequest.respond(res.statusCode, res.headers, res.data);
  }

  async respond(pollyRequest) {
    const [transportWrapper, req] = pollyRequest.requestArguments;

    return transportWrapper.respond(req, pollyRequest.response);
  }
}
