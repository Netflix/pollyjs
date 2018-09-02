interface Headers {
  [key: string]: any;
}

/**
 * Serialize a Headers instance into a pojo since it cannot be stringified.
 * @param {*} headers
 */
export default function serializeHeaders(headers: any[]) {
  if (headers && typeof headers.forEach === 'function') {
    const serializedHeaders = {} as Headers;

    headers.forEach((value, key) => (serializedHeaders[key] = value));

    return serializedHeaders;
  }

  return headers || {};
}
