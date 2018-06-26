// Taken from https://github.com/parshap/utf8-byte-length/blob/master/browser.js

function isHighSurrogate(codePoint) {
  return codePoint >= 0xd800 && codePoint <= 0xdbff;
}

function isLowSurrogate(codePoint) {
  return codePoint >= 0xdc00 && codePoint <= 0xdfff;
}

// Truncate string by size in bytes
export default function getByteLength(string) {
  if (typeof string !== 'string') {
    throw new Error('Input must be string');
  }

  const charLength = string.length;
  let byteLength = 0;
  let codePoint = null;
  let prevCodePoint = null;

  for (let i = 0; i < charLength; i++) {
    codePoint = string.charCodeAt(i);
    // handle 4-byte non-BMP chars
    // low surrogate
    if (isLowSurrogate(codePoint)) {
      // when parsing previous hi-surrogate, 3 is added to byteLength
      if (prevCodePoint != null && isHighSurrogate(prevCodePoint)) {
        byteLength += 1;
      } else {
        byteLength += 3;
      }
    } else if (codePoint <= 0x7f) {
      byteLength += 1;
    } else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
      byteLength += 2;
    } else if (codePoint >= 0x800 && codePoint <= 0xffff) {
      byteLength += 3;
    }
    prevCodePoint = codePoint;
  }

  return byteLength;
}
