import { assert, HTTP_STATUS_CODES } from '@pollyjs/utils';

import HTTPBase from './http-base';

const DEFAULT_STATUS_CODE = 200;

export default class PollyResponse extends HTTPBase {
  constructor(statusCode, headers, body, isBinary = false) {
    super();
    this.status(statusCode || DEFAULT_STATUS_CODE);
    this.setHeaders(headers);
    this.body = body;
    this.isBinary = isBinary;
  }

  get ok() {
    return this.statusCode && this.statusCode >= 200 && this.statusCode < 300;
  }

  get statusText() {
    return (
      HTTP_STATUS_CODES[this.statusCode] ||
      HTTP_STATUS_CODES[DEFAULT_STATUS_CODE]
    );
  }

  status(statusCode) {
    const status = parseInt(statusCode, 10);

    assert(
      `[Response] Invalid status code: ${status}`,
      status >= 100 && status < 600
    );

    this.statusCode = status;

    return this;
  }

  sendStatus(status) {
    this.status(status);
    this.type('text/plain');

    return this.send(this.statusText);
  }
}
