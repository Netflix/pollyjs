import { URL } from '@pollyjs/utils';

/**
 * Generate an absolute url from options passed into `new http.ClientRequest`.
 *
 * @export
 * @param {Object} [options]
 * @returns {string}
 */
export default function getUrlFromOptions(options = {}) {
  const { proto, path, host, port } = options;
  const url = new URL();

  url.set('protocol', `${proto || 'http'}:`);
  url.set('pathname', path);
  url.set('hostname', host);

  if (
    port &&
    !host.includes(':') &&
    (port !== 80 || proto !== 'http') &&
    (port !== 443 || proto !== 'https')
  ) {
    url.set('port', port);
  }

  return url.href;
}
