import { isUtf8Representable, isJSONContent } from 'nock/lib/common';

export function parseBody(body, headers) {
  if (body) {
    if (isJSONContent(headers)) {
      // Nock will parse json content into an object. We have our own way
      // of dealing with json content so convert it back to a string.
      return JSON.stringify(body);
    } else if (
      typeof body === 'string' &&
      !isUtf8Representable(Buffer.from(body, 'hex'))
    ) {
      // Nock internally converts a binary buffer into its hexadecimal
      // representation so convert it back to a buffer.
      return Buffer.from(body, 'hex');
    }
  }
  return body;
}
