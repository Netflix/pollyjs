import stringify from 'json-stable-stringify';

const supportsFormData = typeof FormData !== 'undefined';
const supportsBlob = (() => {
  try {
    return !!new Blob();
  } catch (e) {
    return false;
  }
})();

async function serialize(body) {
  if (supportsFormData && body instanceof FormData) {
    const serialized = {};

    for (const [key, value] of body.entries()) {
      if (supportsBlob && value instanceof Blob) {
        serialized[key] = await readBlob(value);
      } else {
        serialized[key] = value;
      }
    }

    return stringify(serialized);
  }

  if (supportsBlob && body instanceof Blob) {
    return await readBlob(body);
  }

  return body;
}

function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // The split here removes the 'data:image/png;base64,' prefix
    // to just leave the base64 encoded data.
    reader.onload = () => resolve((reader.result || '').split(',')[1]);
    reader.onend = reject;
    reader.onabort = reject;

    reader.readAsDataURL(new Blob([blob], { type: blob.type }));
  });
}

/*
  TODO: For some reason, exporting a named async function causes the entire
  module to be excluded from the build. This is a workaround for now.
*/
export default function serializeRequestBody(body) {
  return serialize(body);
}
