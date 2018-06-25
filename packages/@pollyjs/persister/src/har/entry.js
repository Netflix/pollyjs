import HAR from 'har';

const { keys } = Object;

function toNVPairs(o) {
  return keys(o || {}).map(name => ({ name, value: o[name] }));
}

function harRequest(request) {
  const req = {
    method: request.method,
    url: request.url,
    httpVersion: 'HTTP/1.1',
    headers: toNVPairs(request.headers),
    queryString: toNVPairs(request.query)
  };

  if (request.serializedBody || request.hasHeader('Content-Type')) {
    req.postData = {
      mimeType: request.getHeader('Content-Type') || 'text/plain',
      text: request.serializedBody
    };
  }

  return req;
}

function harResponse(response) {
  const res = {
    status: response.statusCode,
    statusText: response.statusText,
    httpVersion: 'HTTP/1.1',
    headers: toNVPairs(response.headers)
  };

  if (response.body || response.hasHeader('Content-Type')) {
    res.content = {
      mimeType: response.getHeader('Content-Type'),
      text: response.body
    };
  }

  return res;
}

export default function Entry(request) {
  const entry = new HAR.Entry({
    startedDateTime: request.timestamp,
    request: harRequest(request),
    response: harResponse(request.response),
    time: request.responseTime,
    timings: {
      wait: request.responseTime
    }
  });

  entry._id = request.id;
  entry._order = request.order;

  return entry;
}
