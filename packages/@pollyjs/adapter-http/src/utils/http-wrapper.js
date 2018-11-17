import http from 'http';
import https from 'https';

import TransportWrapper from './transport-wrapper';

export default class HttpWrapper {
  constructor({ adapter, options }) {
    this.transports = [];

    const enabledTransports = options.filter(transport =>
      ['http', 'https'].includes(transport)
    );

    adapter.assert(
      'There should be at least one transport enabled',
      enabledTransports.length > 0
    );

    if (enabledTransports.includes('http')) {
      this.transports.push(
        new TransportWrapper(http, { name: 'http', adapter })
      );
    }

    if (enabledTransports.includes('https')) {
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
