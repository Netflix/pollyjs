export default function stringifyRequest(req, ...args) {
  const config = { ...req.config };

  // Remove all adapter & persister config options as they can cause a circular
  // structure to the final JSON
  ['adapter', 'adapterOptions', 'persister', 'persisterOptions'].forEach(
    k => delete config[k]
  );

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
      config
    },
    ...args
  );
}
