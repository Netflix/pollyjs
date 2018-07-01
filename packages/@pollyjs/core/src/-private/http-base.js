import HTTPHeaders from '../utils/http-headers';

const { freeze } = Object;

export default class HTTPBase {
  constructor() {
    this.headers = new HTTPHeaders();
  }

  getHeader(name) {
    return this.headers[name];
  }

  setHeader(name, value) {
    this.headers[name] = value;

    return this;
  }

  setHeaders(headers = {}) {
    for (const name in headers) {
      this.setHeader(name, headers[name]);
    }

    return this;
  }

  hasHeader(name) {
    return !!this.getHeader(name);
  }

  end() {
    freeze(this);
    freeze(this.headers);

    return this;
  }
}
