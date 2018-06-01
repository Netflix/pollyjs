/**
 * Serialize a Headers instance into a pojo since it cannot be stringified.
 * @param {*} headers
 */
export default function serializeHeaders(headers) {
  if (headers && typeof headers.forEach === 'function') {
    const serializedHeaders = {};

    headers.forEach((value, key) => (serializedHeaders[key] = value));

    return serializedHeaders;
  }

  return headers || {};
}
