/* global setupPolly, API_HOST */

describe('Events', function() {
  setupPolly({
    adapters: ['fetch'],
    persister: 'local-storage'
  });

  it('can help test dynamic data', async function() {
    const { server } = this.polly;
    let numPosts = 0;

    server.get(`${API_HOST}/posts`).on('response', (_, res) => {
      numPosts = res.jsonBody().length;
    });

    const res = await fetch(`${API_HOST}/posts`);
    const posts = await res.json();

    expect(res.status).to.equal(200);
    expect(posts.length).to.equal(numPosts);
  });
});
