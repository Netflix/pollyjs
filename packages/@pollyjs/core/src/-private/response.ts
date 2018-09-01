import HTTPBase from './http-base';
import { assert, HTTP_STATUS_CODES } from '@pollyjs/utils';

const DEFAULT_STATUS_CODE = 200;

export default class PollyResponse extends HTTPBase {
  public statusCode: number;
  public timestamp: string;

  constructor(statusCode?: number, headers?: {}, body?: string) {
    super();
    this.status(statusCode || DEFAULT_STATUS_CODE);
    this.setHeaders(headers);
    this.body = body;
  }

  public get ok(): boolean {
    return this.statusCode && this.statusCode >= 200 && this.statusCode < 300;
  }

  public get statusText(): string {
    return (
      HTTP_STATUS_CODES[this.statusCode] ||
      HTTP_STATUS_CODES[DEFAULT_STATUS_CODE]
    );
  }

  public status(statusCode: number | string): this {
    const status = parseInt(<string>statusCode, 10);

    assert(
      `[Response] Invalid status code: ${status}`,
      status >= 100 && status < 600
    );

    this.statusCode = status;

    return this;
  }

  public sendStatus(status: number | string): this {
    this.status(status);
    this.type('text/plain');

    return this.send(status);
  }
}
