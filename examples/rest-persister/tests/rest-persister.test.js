/* global setupPolly */

describe('REST Persister', function() {
  setupPolly({
    adapters: ['fetch'],
    persister: 'rest'
  });

  it('should work', async function() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const post = await res.json();

    expect(res.status).to.equal(200);
    expect(post.id).to.equal(1);
  });
});
