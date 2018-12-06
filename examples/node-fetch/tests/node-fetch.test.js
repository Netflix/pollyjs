const path = require('path');

const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const fetch = require('node-fetch');
const { Polly, setupMocha: setupPolly } = require('@pollyjs/core');
const { expect } = require('chai');

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

describe('node-fetch', function() {
  setupPolly({
    adapters: ['node-http'],
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
