import crypto from 'crypto';

import getBufferFromStream from './get-buffer-from-stream';

export default async function calculateHashFromStream(stream) {
  const hmac = crypto.createHmac('sha256', 'a secret');
  const hashStream = stream.pipe(hmac);

  const hashBuffer = await getBufferFromStream(hashStream);

  return hashBuffer.toString('hex');
}
