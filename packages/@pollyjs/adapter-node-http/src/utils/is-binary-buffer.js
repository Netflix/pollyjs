/**
 * Determine if the given buffer is binary.
 *
 * @export
 * @param {Buffer} [buffer]
 * @returns {boolean}
 */
export default function isBinaryBuffer(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    return false;
  }

  // Test if the buffer can be reconstructed verbatim from its utf8 encoding.
  const utfEncodedBuffer = buffer.toString('utf8');
  const reconstructedBuffer = Buffer.from(utfEncodedBuffer, 'utf8');

  // If the buffers are *not* equal then this is a "binary buffer"
  // meaning that it cannot be faithfully represented in utf8.
  return !compareBuffers(buffer, reconstructedBuffer);
}

function compareBuffers(lhs, rhs) {
  if (lhs.length !== rhs.length) {
    return false;
  }

  for (let i = 0; i < lhs.length; ++i) {
    if (lhs[i] !== rhs[i]) {
      return false;
    }
  }

  return true;
}
