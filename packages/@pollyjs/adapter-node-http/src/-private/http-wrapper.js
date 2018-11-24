import http from 'http';
import https from 'https';

import TransportWrapper from './transport-wrapper';

export default class HttpWrapper {
  constructor({ adapter, options }) {
    this.transports = [];

    if (options.transports.includes('http')) {
      this.transports.push(
        new TransportWrapper(http, { name: 'http', adapter })
      );
    }

    if (options.transports.includes('https')) {
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
