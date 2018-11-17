import http from 'http';
import https from 'https';

import TransportWrapper from './transport-wrapper';

export default class HttpWrapper {
  constructor({ adapter, options }) {
    this.transports = [];

    adapter.assert(
      'There should be at least one transport enabled',
      options.transports.http || options.transports.https
    );

    if (options.transports.http) {
      this.transports.push(
        new TransportWrapper(http, { name: 'http', adapter })
      );
    }

    if (options.transports.https) {
      this.transports.push(
        new TransportWrapper(https, { name: 'https', adapter })
      );
    }
  }

  patch() {
    this.transports.forEach(transport => transport.patch());
  }

  restore() {
    this.transports.forEach(transport => transport.restore());
  }
}
