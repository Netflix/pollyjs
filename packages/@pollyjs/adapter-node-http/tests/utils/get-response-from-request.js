export default function getResponseFromRequest(req, data) {
  return new Promise(resolve => {
    req.on('response', res => {
      resolve(res);
    });

    req.end(data);
  });
}
