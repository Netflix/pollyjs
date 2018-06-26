import toNVPairs from './utils/to-nv-pairs';
import getByteLength from 'utf8-byte-length';

function headersSize(request) {
  const keys = [];
  const values = [];

  request.headers.forEach(({ name, value }) => {
    keys.push(name);
    values.push(value);
  });

  const headersString =
    request.method + request.url + keys.join() + values.join();

  // startline: [method] [url] HTTP/1.1\r\n = 12
  // endline: \r\n = 2
  // every header + \r\n = * 2
  // add 2 for each combined header
  return getByteLength(headersString) + keys.length * 2 + 2 + 12 + 2;
}

export default class Request {
  constructor(request) {
    this.httpVersion = 'HTTP/1.1';
    this.url = request.url;
    this.method = request.method;
    this.headers = toNVPairs(request.headers);
    this.headersSize = headersSize(this);
    this.queryString = toNVPairs(request.query);
    this.cookies = [];

    if (request.body || request.hasHeader('Content-Type')) {
      this.postData = {
        mimeType: request.getHeader('Content-Type') || 'text/plain'
      };

      if (typeof request.body === 'string') {
        this.postData.text = request.body;
      }
    }

    if (request.hasHeader('Content-Length')) {
      this.bodySize = parseInt(request.getHeader('Content-Length'), 10);
    } else {
      this.bodySize =
        this.postData && this.postData.text
          ? getByteLength(this.postData.text)
          : 0;
    }
  }
}
