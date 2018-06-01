/**
 * Serialize response headers which is received as a string, into a pojo
 * @param {String} responseHeaders
 */
export default function serializeResponseHeaders(responseHeaders = '') {
  return responseHeaders.split('\n').reduce((headers, header) => {
    const [key, value] = header.split(':');

    if (key) {
      headers[key] = value.replace(/(\r|\n|^\s+)/g, '');
    }

    return headers;
  }, {});
}
