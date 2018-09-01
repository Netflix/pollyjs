import HTTPHeaders from '../utils/http-headers';
import stringify from 'fast-json-stable-stringify';

const { freeze } = Object;
const { parse } = JSON;

export default class HTTPBase {
  public headers: {};
  public body?: string;

  constructor() {
    this.headers = HTTPHeaders();
  }

  public getHeader(name: string): string {
    return this.headers[name];
  }

  public setHeader(name: string, value: string): this {
    this.headers[name] = value;

    return this;
  }

  public setHeaders(headers = {}) {
    for (const name in headers) {
      this.setHeader(name, headers[name]);
    }

    return this;
  }

  public hasHeader(name: string): boolean {
    return !!this.getHeader(name);
  }

  public type(type: string): this {
    return this.setHeader('Content-Type', type);
  }

  public send(data: any): this {
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

  public json(obj?: {}): this {
    if (!this.hasHeader('Content-Type')) {
      this.type('application/json');
    }

    return this.send(stringify(obj));
  }

  public jsonBody(): {} {
    return parse(this.body);
  }

  public end(): this {
    freeze(this);
    freeze(this.headers);

    return this;
  }
}
