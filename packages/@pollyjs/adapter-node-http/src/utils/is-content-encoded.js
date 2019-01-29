import isObjectLike from 'lodash-es/isObjectLike';

/**
 * Determine if a request's content is encoded by the headers it has.
 *
 * @export
 * @param {Object} [headers]
 * @returns {boolean}
 */
export default function isContentEncoded(headers) {
  const contentEncoding = isObjectLike(headers)
    ? headers['content-encoding']
    : '';

  return !!(contentEncoding && typeof contentEncoding === 'string');
}
