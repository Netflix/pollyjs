import stringify from 'json-stable-stringify';

const { freeze } = Object;

function formatHeader(name) {
  return (name || '').toLowerCase();
}

function status(statusCode) {
  return parseInt(statusCode, 10) || null;
}

export default class PollyResponse {
  constructor(statusCode, headers, body) {
    this.statusCode = status(statusCode);
    this.headers = headers || {};
    this.body = body;
  }

  get ok() {
    return this.statusCode && this.statusCode >= 200 && this.statusCode < 300;
  }

  status(statusCode) {
    this.statusCode = status(statusCode);

    return this;
  }

  getHeader(name) {
    return this.headers[formatHeader(name)];
  }

  setHeader(name, value) {
    const { headers } = this;

    if (!value) {
      delete headers[formatHeader(name)];
    } else {
      headers[formatHeader(name)] = value;
    }

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

  end() {
    freeze(this);
    freeze(this.headers);

    return this;
  }
}
