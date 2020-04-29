const { isArray } = Array;

export default function normalizeRecordedResponse(response) {
  const { status, statusText, headers, content } = response;

  return {
    statusText,
    statusCode: status,
    headers: normalizeHeaders(headers),
    body: content && content.text,
    isBinary: Boolean(content && content._isBinary)
  };
}

function normalizeHeaders(headers) {
  return (headers || []).reduce((accum, { name, value, _fromType }) => {
    const existingValue = accum[name];

    if (existingValue) {
      if (!isArray(existingValue)) {
        accum[name] = [existingValue];
      }

      accum[name].push(value);
    } else {
      accum[name] = _fromType === 'array' ? [value] : value;
    }

    return accum;
  }, {});
}
