import { HTTP_METHODS } from '@pollyjs/utils';

import Server from '../../../src/server';

let server;

function request(method, path) {
  return server.lookup(method, path).handlers[0].get('intercept')();
}

describe('Unit | Server', function () {
  it('should exist', function () {
    expect(() => new Server()).to.not.throw();
    expect(new Server()).to.exist;
  });

  describe('API', function () {
    beforeEach(function () {
      server = new Server();
    });

    it('should handle all HTTP methods', function () {
      HTTP_METHODS.forEach((method) => {
        server[method.toLowerCase()]('/foo').intercept(() => 200);
        expect(request(method, '/foo')).to.equal(200);
      });
    });

    it('should handle multiple routes on all HTTP methods', function () {
      HTTP_METHODS.forEach((method) => {
        server[method.toLowerCase()]([
          `/${method}`,
          `/${method}/*path`
        ]).intercept(() => 200);

        expect(request(method, `/${method}`)).to.equal(200);
        expect(request(method, `/${method}/foo/bar`)).to.equal(200);
      });
    });

    it('should handle dynamic segments', function () {
      server.get('/foo/:seg1').intercept(() => 200);
      server.get('/foo/:seg1/bar/:seg2').intercept(() => 400);

      expect(request('GET', '/foo/42')).to.equal(200);
      expect(request('GET', '/foo/super-secret-guid')).to.equal(200);

      expect(request('GET', '/foo/42/bar/abc')).to.equal(400);
    });

    it('should differentiate hosts with different protocols', function () {
      ['http', 'https'].forEach((protocol) => {
        server.get(`${protocol}://foo.bar`).intercept(() => protocol);
        expect(request('GET', `${protocol}://foo.bar`)).to.equal(protocol);
      });
    });

    it('can be scoped to a host', function () {
      server.host('http://foo.bar', () => {
        server.get('/baz').intercept(() => 200);
      });

      expect(request('GET', 'http://foo.bar/baz')).to.equal(200);
    });

    it('can handle index route registration', function () {
      server.host('http://foo', () => {
        server.get('/').intercept(() => 200);
      });

      expect(request('GET', 'http://foo')).to.equal(200);
      expect(request('GET', 'http://foo/')).to.equal(200);
    });

    it('should reset the host after scoping', function () {
      server.host('http://foo.bar', () => {});
      server.get('/foo').intercept(() => 200);

      expect(() => request('GET', 'http://foo.bar/foo')).to.throw();
      expect(request('GET', '/foo')).to.equal(200);
    });

    it('should throw when nesting hosts', function () {
      expect(() => {
        server.host('http://foo.bar', () => {
          server.host('http://bar.baz', () => {});
        });
      }).to.throw();
    });

    it('should reset the namespace after scoping', function () {
      server.namespace('/api', () => {});
      server.get('/foo').intercept(() => 200);

      expect(() => request('GET', '/api/foo')).to.throw();
      expect(request('GET', '/foo')).to.equal(200);
    });

    it('can be scoped to multiple namespaces', function () {
      server.namespace('/api', () => {
        server.get('/foo').intercept(() => 'foo');

        server.namespace('/v2', () => {
          server.get('/bar').intercept(() => 'bar');
        });
      });

      expect(request('GET', '/api/foo')).to.equal('foo');
      expect(request('GET', '/api/v2/bar')).to.equal('bar');
    });
  });

  describe('Route Matching', function () {
    beforeEach(function () {
      server = new Server();
    });

    function addHandlers(url) {
      server.get(url).on('request', () => {});
      server.get(url).on('response', () => {});
      server.get(url).intercept(() => {});
    }

    it('should concat handlers for same paths', async function () {
      [
        '/ping',
        '/ping/:id',
        '/ping/*path',
        'http://ping.com',
        'http://ping.com/pong/:id',
        'http://ping.com/pong/*path'
      ].forEach((url) => {
        addHandlers(url);
        expect(server.lookup('GET', url).handlers).to.have.lengthOf(3);
      });
    });

    it('should concat handlers for same paths with a trailing slash', async function () {
      addHandlers('/ping');
      expect(server.lookup('GET', '/ping').handlers).to.have.lengthOf(3);

      addHandlers('/ping/');
      expect(server.lookup('GET', '/ping').handlers).to.have.lengthOf(6);
      expect(server.lookup('GET', '/ping/').handlers).to.have.lengthOf(6);

      addHandlers('http://ping.com');
      expect(server.lookup('GET', 'http://ping.com').handlers).to.have.lengthOf(
        3
      );

      addHandlers('http://ping.com/');
      expect(server.lookup('GET', 'http://ping.com').handlers).to.have.lengthOf(
        6
      );
      expect(
        server.lookup('GET', 'http://ping.com/').handlers
      ).to.have.lengthOf(6);
    });

    it('should concat handlers for same paths with different dynamic segment names', async function () {
      addHandlers('/ping/:id');
      expect(server.lookup('GET', '/ping/:id').handlers).to.have.lengthOf(3);

      addHandlers('/ping/:uuid');
      expect(server.lookup('GET', '/ping/:id').handlers).to.have.lengthOf(6);
      expect(server.lookup('GET', '/ping/:uuid').handlers).to.have.lengthOf(6);
    });

    it('should concat handlers for same paths with different star segment names', async function () {
      addHandlers('/ping/*path');
      expect(server.lookup('GET', '/ping/*path').handlers).to.have.lengthOf(3);

      addHandlers('/ping/*rest');
      expect(server.lookup('GET', '/ping/*path').handlers).to.have.lengthOf(6);
      expect(server.lookup('GET', '/ping/*rest').handlers).to.have.lengthOf(6);
    });

    it('should concat handlers for same paths with different dynamic and star segment names', async function () {
      addHandlers('/ping/:id/pong/*path');
      expect(
        server.lookup('GET', '/ping/:id/pong/*path').handlers
      ).to.have.lengthOf(3);

      addHandlers('/ping/:uuid/pong/*rest');
      expect(
        server.lookup('GET', '/ping/:id/pong/*path').handlers
      ).to.have.lengthOf(6);
      expect(
        server.lookup('GET', '/ping/:uuid/pong/*rest').handlers
      ).to.have.lengthOf(6);
    });
  });
});
