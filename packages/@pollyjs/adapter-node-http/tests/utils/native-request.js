import { Response } from 'node-fetch';

import getResponseFromRequest from './get-response-from-request';

export default async function nativeRequest(transport, url, options) {
  const response = await getResponseFromRequest(
    transport.request(url, options),
    options && options.body ? options.body : undefined
  );

  return new Response(response, {
    status: response.statusCode,
    headers: response.headers
  });
}
