const { default: fetch, Response, Request, Headers } = require.requireActual('node-fetch');

// Give polly fetch adapter access to node-fetch
// implementation
global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Use global fetch as a mock. It will be 
// the one overwritten by polly
const mock = (url, options) => {
  return global.fetch(
    // Polly doesn't support URL objects with fetch
    // adapter, we will work around it by stringifying
    // the passed URL
    url.toString(),
    options
  );
}
 
mock.Request = Request;
mock.Response = Response;
mock.Headers = Headers;

// This mock will be auto applied every time application
// code requires `node-fetch` library
module.exports = mock;