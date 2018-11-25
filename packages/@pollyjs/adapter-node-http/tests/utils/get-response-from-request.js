export default function getResponseFromRequest(req) {
  return new Promise(resolve => {
    req.on('response', res => {
      resolve(res);
    });

    req.end();
  });
}
