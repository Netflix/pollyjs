/* Start - Setup Global Fetch*/
(function() {
  const { default: fetch, Response, Request, Headers } = require('node-fetch');

  global.fetch = fetch;
  global.Request = Request;
  global.Response = Response;
  global.Headers = Headers;
})();
/* End - Setup Global Fetch*/

const path = require('path');
const FetchAdapter = require('@pollyjs/adapter-fetch');
const FSPersister = require('@pollyjs/persister-fs');
const { Polly, setupMocha: setupPolly } = require('@pollyjs/core');
const { expect } = require('chai');

Polly.register(FetchAdapter);
Polly.register(FSPersister);

describe('node-fetch', function() {
  setupPolly({
    adapters: ['fetch'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../recordings')
      }
    }
  });

  it('should work', async function() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const post = await res.json();

    expect(res.status).to.equal(200);
    expect(post.id).to.equal(1);
  });
});
