export default function getResponseFromRequest(req, data) {
  return new Promise((resolve, reject) => {
    req.once('response', resolve);
    req.once('error', reject);

    req.end(data);
  });
}
