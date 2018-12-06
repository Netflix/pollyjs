import http from 'http';
import https from 'https';

import semver from 'semver';

import TransportWrapper from './transport-wrapper';

export default class HttpWrapper {
  constructor({ adapter, options }) {
    this.transports = [];

    if (options.transports.includes('http')) {
      this.transports.push(
        new TransportWrapper(http, { name: 'http', adapter })
      );
    }

    if (
      options.transports.includes('https') &&
      // Node 8 and below uses http.request under the hood for https.request
      // so we should skip wrapping it even if enabled.
      // https://github.com/nodejs/node/blob/v8.14.0/lib/https.js#L245
      semver.gte(process.version, '9.0.0')
    ) {
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
