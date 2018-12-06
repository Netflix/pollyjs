import Url from 'url';

import { Response } from 'node-fetch';

import getResponseFromRequest from './get-response-from-request';

export default async function nativeRequest(transport, url, options) {
  const opts = {
    ...(options || {}),
    ...Url.parse(url)
  };
  let reqBody;

  if (opts.body) {
    reqBody = opts.body;
    delete opts.body;
  }

  const response = await getResponseFromRequest(
    transport.request(opts),
    reqBody
  );

  return new Response(response, {
    status: response.statusCode,
    headers: response.headers
  });
}
