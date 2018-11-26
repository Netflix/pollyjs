export const supportsBlob = (() => {
  try {
    return !!new Blob();
  } catch (e) {
    return false;
  }
})();

export function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onend = reject;
    reader.onabort = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(new Blob([blob], { type: blob.type }));
  });
}

export async function serialize(body) {
  if (supportsBlob && body instanceof Blob) {
    return await readBlob(body);
  }

  return body;
}
