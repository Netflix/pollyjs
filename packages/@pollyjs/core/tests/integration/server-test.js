import { setupMocha as setupPolly } from '../../src';

describe('Integration | Server', function() {
  setupPolly();

  describe('Events & Middleware', function() {
    it('event: request', async function() {
      const { server } = this.polly;
      let requestCalled = false;

      server
        .get('/ping')
        .intercept((req, res) => {
          expect(requestCalled).to.be.true;
          res.sendStatus(200);
        })
        .on('request', () => {
          expect(requestCalled).to.be.false;
          requestCalled = true;
        });

      expect((await fetch('/ping')).status).to.equal(200);
      expect(requestCalled).to.be.true;
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

    it('event: response', async function() {
      const { server } = this.polly;
      let responseCalled = false;

      server
        .get('/ping')
        .intercept((req, res) => {
          expect(responseCalled).to.be.false;
          res.sendStatus(200);
        })
        .on('response', (req, res) => {
          expect(responseCalled).to.be.false;
          expect(req.didRespond).to.be.true;
          expect(res.statusCode).to.equal(200);

          responseCalled = true;
        });

      expect((await fetch('/ping')).status).to.equal(200);
      expect(responseCalled).to.be.true;
    });

    it('can register multiple event handlers', async function() {
      const { server } = this.polly;
      const stack = [];

      server
        .get('/ping')
        .intercept((req, res) => res.sendStatus(200))
        .on('request', () => stack.push(1))
        .on('request', () => stack.push(2))
        .on('beforeResponse', () => stack.push(3))
        .on('beforeResponse', () => stack.push(4))
        .on('response', () => stack.push(5))
        .on('response', () => stack.push(6));

      expect((await fetch('/ping')).status).to.equal(200);
      expect(stack).to.deep.equal([1, 2, 3, 4, 5, 6]);
    });

    it('can turn off events', async function() {
      const { server } = this.polly;
      let requestCalled,
        beforeResponseCalled = false;

      const handler = server
        .get('/ping')
        .intercept((req, res) => res.sendStatus(200))
        .on('request', () => (requestCalled = true))
        .on('beforeResponse', () => (beforeResponseCalled = true));

      expect((await fetch('/ping')).status).to.equal(200);
      expect(requestCalled).to.be.true;
      expect(beforeResponseCalled).to.be.true;

      requestCalled = beforeResponseCalled = false;
      handler.off('request').off('beforeResponse');

      expect((await fetch('/ping')).status).to.equal(200);
      expect(requestCalled).to.be.false;
      expect(beforeResponseCalled).to.be.false;
    });

    it('events receive params', async function() {
      const { server } = this.polly;

      server
        .any('/ping')
        .on('request', req => {
          expect(req.params).to.deep.equal({});
        })
        .on('beforeResponse', req => {
          expect(req.params).to.deep.equal({});
        });

      server
        .any('/ping/:id')
        .on('request', req => {
          expect(req.params).to.deep.equal({ id: '1' });
        })
        .on('beforeResponse', req => {
          expect(req.params).to.deep.equal({ id: '1' });
        });

      server
        .get('/ping/:id/:id2/*path')
        .intercept((req, res) => res.sendStatus(200))
        .on('request', req => {
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
      const requestOrder = [];
      const beforeResponseOrder = [];

      server
        .any()
        .on('request', () => {
          requestOrder.push(1);
        })
        .on('beforeResponse', () => {
          beforeResponseOrder.push(1);
        });

      server
        .any()
        .on('request', () => {
          requestOrder.push(2);
        })
        .on('beforeResponse', () => {
          beforeResponseOrder.push(2);
        });

      server
        .any('/ping/:id')
        .on('request', async () => {
          await server.timeout(5);
          requestOrder.push(3);
        })
        .on('beforeResponse', async () => {
          await server.timeout(5);
          beforeResponseOrder.push(3);
        });

      server
        .any(['/ping', '/ping/*path'])
        .on('request', () => {
          requestOrder.push(4);
        })
        .on('beforeResponse', () => {
          beforeResponseOrder.push(4);
        });

      server
        .get('/ping/:id')
        .intercept((req, res) => res.sendStatus(200))
        .on('request', () => requestOrder.push(5))
        .on('beforeResponse', () => beforeResponseOrder.push(5));

      expect((await fetch('/ping/1')).status).to.equal(200);
      expect(requestOrder).to.deep.equal([1, 2, 3, 4, 5]);
      expect(beforeResponseOrder).to.deep.equal([1, 2, 3, 4, 5]);
    });
  });
});
