import stringify from 'json-stable-stringify';
import { assert, HTTP_STATUS_CODES } from '@pollyjs/utils';
import HTTPBase from './http-base';

const DEFAULT_STATUS_CODE = 200;

export default class PollyResponse extends HTTPBase {
  constructor(statusCode, headers, body) {
    super();
    this.status(statusCode || DEFAULT_STATUS_CODE);
    this.setHeaders(headers);
    this.body = body;
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

  type(type) {
    return this.setHeader('Content-Type', type);
  }

  send(data) {
    let body = data;

    switch (typeof body) {
      case 'string':
        // String defaulting to html
        if (!this.hasHeader('Content-Type')) {
          this.type('text/html');
        }

        break;
      case 'boolean':
      case 'number':
      case 'object':
        if (body === null) {
          body = '';
        } else {
          return this.json(body);
        }

        break;
    }

    if (typeof body === 'string') {
      const contentType = this.getHeader('Content-Type');

      // Write strings in utf-8
      if (contentType && !contentType.includes('charset')) {
        this.type(`${contentType}; charset=utf-8`);
      }
    }

    this.body = body;

    return this;
  }

  sendStatus(status) {
    this.status(status);
    this.type('text/plain');

    return this.send(status);
  }

  json(obj) {
    if (!this.hasHeader('Content-Type')) {
      this.type('application/json');
    }

    return this.send(stringify(obj));
  }
}
