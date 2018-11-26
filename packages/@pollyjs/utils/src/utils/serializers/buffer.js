/* eslint-env node */

export const supportsBuffer = typeof Buffer !== 'undefined';
export const supportsArrayBuffer = typeof ArrayBuffer !== 'undefined';

export function serialize(body) {
  if (supportsBuffer && body) {
    let buffer;

    if (Buffer.isBuffer(body)) {
      buffer = body;
    } else if (Array.isArray(body) && body.some(c => Buffer.isBuffer(c))) {
      // Body is a chunked array
      const chunks = body.map(c => Buffer.from(c));

      buffer = Buffer.concat(chunks);
    } else if (`${body}` === '[object ArrayBuffer]') {
      buffer = Buffer.from(body);
    } else if (supportsArrayBuffer && ArrayBuffer.isView(body)) {
      buffer = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    }

    if (Buffer.isBuffer(buffer)) {
      return buffer.toString('hex');
    }
  }

  return body;
}
