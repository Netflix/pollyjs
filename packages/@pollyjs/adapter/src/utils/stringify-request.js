export default function stringifyRequest(req, ...args) {
  return JSON.stringify(
    {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      recordingName: req.recordingName,
      id: req.id,
      order: req.order,
      identifiers: req.identifiers,
      config: req.config
    },
    ...args
  );
}
