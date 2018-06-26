import toNVPairs from './utils/to-nv-pairs';
import getByteLength from './utils/get-byte-length';

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

export default class HARRequest {
  constructor(request) {
    this.httpVersion = 'HTTP/1.1';
    this.url = request.url;
    this.method = request.method;
    this.headers = toNVPairs(request.headers);
    this.queryString = toNVPairs(request.query);
    this.cookies = [];

    if (request.serializedBody || request.hasHeader('Content-Type')) {
      this.postData = {
        mimeType: request.getHeader('Content-Type') || 'text/plain',
        text: request.serializedBody
      };
    }

    this.headersSize = headersSize(this);
    this.bodySize =
      this.postData && this.postData.text
        ? getByteLength(this.postData.text)
        : 0;
  }
}
