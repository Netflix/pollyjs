import { setupMocha as setupPolly } from '../../src';

describe('Integration | Server', function() {
  setupPolly();

  describe('Events & Middleware', function() {
    it('event: beforeRequest', async function() {
      const { server } = this.polly;
      let beforeRequestCalled = false;

      server
        .get('/ping')
        .intercept((req, res) => {
          expect(beforeRequestCalled).to.be.true;
          res.sendStatus(200);
        })
        .on('beforeRequest', () => {
          expect(beforeRequestCalled).to.be.false;
          beforeRequestCalled = true;
        });

      expect((await fetch('/ping')).status).to.equal(200);
      expect(beforeRequestCalled).to.be.true;
    });

    it('event: beforeResponse', async function() {
      const { server } = this.polly;
      let beforeResponseCalled = false;

      server
        .get('/ping')
        .intercept((req, res) => {
          expect(beforeResponseCalled).to.be.false;
          res.sendStatus(200);
        })
        .on('beforeResponse', (req, res) => {
          expect(beforeResponseCalled).to.be.false;
          expect(res.statusCode).to.equal(200);

          res.sendStatus(201);
          beforeResponseCalled = true;
        });

      expect((await fetch('/ping')).status).to.equal(201);
      expect(beforeResponseCalled).to.be.true;
    });

    it('event: afterResponse', async function() {
      const { server } = this.polly;
      let afterResponseCalled = false;

      server
        .get('/ping')
        .intercept((req, res) => {
          expect(afterResponseCalled).to.be.false;
          res.sendStatus(200);
        })
        .on('afterResponse', (req, res) => {
          expect(afterResponseCalled).to.be.false;
          expect(req.didRespond).to.be.true;
          expect(res.statusCode).to.equal(200);

          afterResponseCalled = true;
        });

      expect((await fetch('/ping')).status).to.equal(200);
      expect(afterResponseCalled).to.be.true;
    });

    it('can register multiple event handlers', async function() {
      const { server } = this.polly;
      const stack = [];

      server
        .get('/ping')
        .intercept((req, res) => res.sendStatus(200))
        .on('beforeRequest', () => stack.push(1))
        .on('beforeRequest', () => stack.push(2))
        .on('beforeResponse', () => stack.push(3))
        .on('beforeResponse', () => stack.push(4))
        .on('afterResponse', () => stack.push(5))
        .on('afterResponse', () => stack.push(6));

      expect((await fetch('/ping')).status).to.equal(200);
      expect(stack).to.deep.equal([1, 2, 3, 4, 5, 6]);
    });

    it('can turn off events', async function() {
      const { server } = this.polly;
      let beforeRequestCalled,
        beforeResponseCalled = false;

      const handler = server
        .get('/ping')
        .intercept((req, res) => res.sendStatus(200))
        .on('beforeRequest', () => (beforeRequestCalled = true))
        .on('beforeResponse', () => (beforeResponseCalled = true));

      expect((await fetch('/ping')).status).to.equal(200);
      expect(beforeRequestCalled).to.be.true;
      expect(beforeResponseCalled).to.be.true;

      beforeRequestCalled = beforeResponseCalled = false;
      handler.off('beforeRequest').off('beforeResponse');

      expect((await fetch('/ping')).status).to.equal(200);
      expect(beforeRequestCalled).to.be.false;
      expect(beforeResponseCalled).to.be.false;
    });

    it('events receive params', async function() {
      const { server } = this.polly;

      server
        .any('/ping')
        .on('beforeRequest', req => {
          expect(req.params).to.deep.equal({});
        })
        .on('beforeResponse', req => {
          expect(req.params).to.deep.equal({});
        });

      server
        .any('/ping/:id')
        .on('beforeRequest', req => {
          expect(req.params).to.deep.equal({ id: '1' });
        })
        .on('beforeResponse', req => {
          expect(req.params).to.deep.equal({ id: '1' });
        });

      server
        .get('/ping/:id/:id2/*path')
        .intercept((req, res) => res.sendStatus(200))
        .on('beforeRequest', req => {
          expect(req.params).to.deep.equal({
            id: '1',
            id2: '2',
            path: 'foo/bar'
          });
        })
        .on('beforeResponse', req => {
          expect(req.params).to.deep.equal({
            id: '1',
            id2: '2',
            path: 'foo/bar'
          });
        });

      expect((await fetch('/ping/1/2/foo/bar')).status).to.equal(200);
    });

    it('preserves middleware order', async function() {
      const { server } = this.polly;
      const beforeRequestOrder = [];
      const beforeResponseOrder = [];

      server
        .any()
        .on('beforeRequest', () => {
          beforeRequestOrder.push(1);
        })
        .on('beforeResponse', () => {
          beforeResponseOrder.push(1);
        });

      server
        .any()
        .on('beforeRequest', () => {
          beforeRequestOrder.push(2);
        })
        .on('beforeResponse', () => {
          beforeResponseOrder.push(2);
        });

      server
        .any('/ping/:id')
        .on('beforeRequest', async () => {
          await server.timeout(5);
          beforeRequestOrder.push(3);
        })
        .on('beforeResponse', async () => {
          await server.timeout(5);
          beforeResponseOrder.push(3);
        });

      server
        .any(['/ping', '/ping/*path'])
        .on('beforeRequest', () => {
          beforeRequestOrder.push(4);
        })
        .on('beforeResponse', () => {
          beforeResponseOrder.push(4);
        });

      server
        .get('/ping/:id')
        .intercept((req, res) => res.sendStatus(200))
        .on('beforeRequest', () => beforeRequestOrder.push(5))
        .on('beforeResponse', () => beforeResponseOrder.push(5));

      expect((await fetch('/ping/1')).status).to.equal(200);
      expect(beforeRequestOrder).to.deep.equal([1, 2, 3, 4, 5]);
      expect(beforeResponseOrder).to.deep.equal([1, 2, 3, 4, 5]);
    });
  });
});
