interface ResponseHeaders {
  [key: string]: string;
}

/**
 * Serialize response headers which is received as a string, into a pojo
 *
 * @param {String} responseHeaders
 */
export default function serializeResponseHeaders(responseHeaders: string): ResponseHeaders {
  if (typeof responseHeaders !== 'string') {
    return responseHeaders;
  }

  return responseHeaders.split('\n').reduce((headers: ResponseHeaders, header) => {
    const [key, value] = header.split(':');

    if (key) {
      headers[key] = value.replace(/(\r|\n|^\s+)/g, '');
    }

    return headers;
  }, {});
}
