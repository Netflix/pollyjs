import isObjectLike from 'lodash-es/isObjectLike';

export default function isContentEncoded(headers) {
  const contentEncoding = isObjectLike(headers)
    ? headers['content-encoding']
    : '';

  return !!(contentEncoding && typeof contentEncoding === 'string');
}
