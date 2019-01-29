import { URL } from '@pollyjs/utils';

/**
 * Generate an absolute url from options passed into `new http.ClientRequest`.
 *
 * @export
 * @param {Object} [options]
 * @returns {string}
 */
export default function getUrlFromOptions(options = {}) {
  if (options.href) {
    return options.href;
  }

  const protocol = options.protocol || `${options.proto}:` || 'http:';
  const host = options.hostname || options.host || 'localhost';
  const { path, port } = options;
  const url = new URL();

  url.set('protocol', protocol);
  url.set('host', host);
  url.set('pathname', path);

  if (
    port &&
    !host.includes(':') &&
    (port !== 80 || protocol !== 'http:') &&
    (port !== 443 || protocol !== 'https:')
  ) {
    url.set('port', port);
  }

  return url.href;
}
