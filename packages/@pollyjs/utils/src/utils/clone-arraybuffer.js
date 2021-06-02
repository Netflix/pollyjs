/**
 * Clone an array buffer
 *
 * @param {ArrayBuffer} arrayBuffer
 */
export default function cloneArrayBuffer(arrayBuffer) {
  const clonedArrayBuffer = new ArrayBuffer(arrayBuffer.byteLength);

  new Uint8Array(clonedArrayBuffer).set(new Uint8Array(arrayBuffer));

  return clonedArrayBuffer;
}
