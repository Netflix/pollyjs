import http from 'http';
import https from 'https';

import TransportWrapper from './transport-wrapper';

export default class HttpWrapper {
  constructor({ adapter }) {
    this.transports = [
      new TransportWrapper(http, { adapter }),
      new TransportWrapper(https, { adapter })
    ];
  }

  patch() {
    this.transports.forEach(transport => transport.patch());
  }

  restore() {
    this.transports.forEach(transport => transport.restore());
  }
}
