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
    const data = [];

    for (const [key, value] of body.entries()) {
      if (supportsBlob && value instanceof Blob) {
        const blobContent = await readBlob(value);

        data.push(`${key}=${blobContent}`);
      } else {
        data.push(`${key}=${value}`);
      }
    }

    return data.join('\r\n');
  }

  if (supportsBlob && body instanceof Blob) {
    return await readBlob(body);
  }

  return body;
}

function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onend = reject;
    reader.onabort = reject;
    reader.onload = () => resolve(reader.result);
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
