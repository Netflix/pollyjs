import toNVPairs, { NVPairs } from './utils/to-nv-pairs';
import getByteLength from 'utf8-byte-length';
import setCookies from 'set-cookie-parser';

function headersSize(response: Response) {
  const keys: string[] = [];
  const values: string[] = [];

  response.headers.forEach(({ name, value }) => {
    keys.push(name);
    values.push(value);
  });

  const headersString = keys.join() + values.join();

  // endline: \r\n = 2
  // every header + \r\n = * 2
  // add 2 for each combined header
  return getByteLength(headersString) + keys.length * 2 + 2 + 2;
}

export default class Response {
  public httpVersion: string;
  public status: number;
  public statusText: string;
  public headers: NVPairs;
  public headersSize: number;
  public redirectURL: string;
  public cookies: setCookies.Cookie[];
  public bodySize: number;
  public content?: {
    mimeType: string
    size: number
    text?: string
  }

  constructor(response: PollyResponse) {
    this.httpVersion = 'HTTP/1.1';
    this.status = response.statusCode;
    this.statusText = response.statusText;
    this.headers = toNVPairs(response.headers);
    this.headersSize = headersSize(this);
    this.cookies = setCookies.parse(response.getHeader('Set-Cookie'));
    this.redirectURL = '';

    this.content = {
      mimeType: response.getHeader('Content-Type') || 'text/plain',
      size: 0
    };

    if (response.body && typeof response.body === 'string') {
      this.content.text = response.body;
    }

    if (response.hasHeader('Content-Length')) {
      this.content.size = parseInt(response.getHeader('Content-Length'), 10);
    } else {
      this.content.size = this.content.text
        ? getByteLength(this.content.text)
        : 0;
    }

    this.bodySize = this.content ? this.content.size : 0;
  }
}
