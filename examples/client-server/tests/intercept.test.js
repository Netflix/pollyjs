/* global setupPolly */

describe('Intercept', function() {
  setupPolly({
    adapters: ['fetch'],
    persister: 'local-storage'
  });

  it('can mock valid responses', async function() {
    const { server } = this.polly;

    server
      .get('https://jsonplaceholder.typicode.com/posts/:id')
      .intercept((req, res) => {
        res.status(200).json({
          id: Number(req.params.id),
          title: `Post ${req.params.id}`
        });
      });

    const res = await fetch('https://jsonplaceholder.typicode.com/posts/42');
    const post = await res.json();

    expect(res.status).to.equal(200);
    expect(post.id).to.equal(42);
    expect(post.title).to.equal('Post 42');
  });

  it('can mock invalid responses', async function() {
    const { server } = this.polly;

    server
      .get('https://jsonplaceholder.typicode.com/posts/404')
      .intercept((_, res) => {
        res.status(404).send('Post not found.');
      });

    const res = await fetch('https://jsonplaceholder.typicode.com/posts/404');
    const text = await res.text();

    expect(res.status).to.equal(404);
    expect(text).to.equal('Post not found.');
  });

  it('can conditionally intercept requests', async function() {
    const { server } = this.polly;

    server
      .get('https://jsonplaceholder.typicode.com/posts/:id')
      .intercept((req, res, interceptor) => {
        if (req.params.id === '42') {
          res.status(200).send('Life');
        } else {
          // Abort out of the intercept handler and continue with the request
          interceptor.abort();
        }
      });

    let res = await fetch('https://jsonplaceholder.typicode.com/posts/42');

    expect(res.status).to.equal(200);
    expect(await res.text()).to.equal('Life');

    res = await fetch('https://jsonplaceholder.typicode.com/posts/1');

    expect(res.status).to.equal(200);
    expect((await res.json()).id).to.equal(1);
  });
});
