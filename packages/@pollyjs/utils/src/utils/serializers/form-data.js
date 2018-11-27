import { supportsBlob, readBlob } from './blob';

export const supportsFormData = typeof FormData !== 'undefined';

export async function serialize(body) {
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

  return body;
}
