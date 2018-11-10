import isAbsoluteUrl from 'is-absolute-url';
import { URL } from '@pollyjs/utils';

import removeHostFromUrl from './remove-host-from-url';

/**
 * Creates an exact representation of the passed url string with url-parse.
 *
 * @param {String} url
 * @param {...args} args Arguments to pass through to the URL constructor
 * @returns {URL} A url-parse URL instance
 */
export default function parseUrl(url, ...args) {
  const parsedUrl = new URL(url, ...args);

  if (!isAbsoluteUrl(url)) {
    if (url.startsWith('//')) {
      /*
        If the url is protocol-relative, strip out the protocol
      */
      parsedUrl.set('protocol', '');
    } else {
      /*
        If the url is relative, setup the parsed url to reflect just that
        by removing the host. By default URL sets the host via window.location if
        it does not exist.
      */
      removeHostFromUrl(parsedUrl);
    }
  }

  return parsedUrl;
}
