/**
 * Remove the host, protocol, and slashes from a URL instance.
 *
 * @param {URL} url
 */
export default function removeHostFromUrl(url) {
  url.set('protocol', '');
  url.set('host', '');
  url.set('slashes', false);

  return url;
}
