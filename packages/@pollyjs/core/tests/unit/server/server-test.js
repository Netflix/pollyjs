import Server from '../../../src/server';

const METHODS = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

let server;

function request(method, path) {
  return server.lookup(method, path).handler._intercept();
}

describe('Unit | Server', function() {
  it('should exist', function() {
    expect(() => new Server()).to.not.throw();
    expect(new Server()).to.exist;
  });

  describe('API', function() {
    beforeEach(function() {
      server = new Server();
    });

    it('should handle all HTTP methods', function() {
      METHODS.forEach(method => {
        server[method.toLowerCase()]('/foo').intercept(() => 200);
        expect(request(method, '/foo')).to.equal(200);
      });
    });

    it('should handle multiple routes on all HTTP methods', function() {
      METHODS.forEach(method => {
        server[method.toLowerCase()]([
          `/${method}`,
          `/${method}/*path`
        ]).intercept(() => 200);

        expect(request(method, `/${method}`)).to.equal(200);
        expect(request(method, `/${method}/foo/bar`)).to.equal(200);
      });
    });

    it('should handle dynamic segments', function() {
      server.get('/foo/:seg1').intercept(() => 200);
      server.get('/foo/:seg1/bar/:seg2').intercept(() => 400);

      expect(request('GET', '/foo/42')).to.equal(200);
      expect(request('GET', '/foo/super-secret-guid')).to.equal(200);

      expect(request('GET', '/foo/42/bar/abc')).to.equal(400);
    });

    it('should differentiate hosts with different protocols', function() {
      ['http', 'https'].forEach(protocol => {
        server.get(`${protocol}://foo.bar`).intercept(() => protocol);
        expect(request('GET', `${protocol}://foo.bar`)).to.equal(protocol);
      });
    });

    it('can be scoped to a host', function() {
      server.host('http://foo.bar', () => {
        server.get('/baz').intercept(() => 200);
      });

      expect(request('GET', 'http://foo.bar/baz')).to.equal(200);
    });

    it('can handle index route registration', function() {
      server.host('http://foo', () => {
        server.get('/').intercept(() => 200);
      });

      expect(request('GET', 'http://foo')).to.equal(200);
      expect(request('GET', 'http://foo/')).to.equal(200);
    });

    it('should reset the host after scoping', function() {
      server.host('http://foo.bar', () => {});
      server.get('/foo').intercept(() => 200);

      expect(() => request('GET', 'http://foo.bar/foo')).to.throw();
      expect(request('GET', '/foo')).to.equal(200);
    });

    it('should throw when nesting hosts', function() {
      expect(() => {
        server.host('http://foo.bar', () => {
          server.host('http://bar.baz', () => {});
        });
      }).to.throw();
    });

    it('should reset the namespace after scoping', function() {
      server.namespace('/api', () => {});
      server.get('/foo').intercept(() => 200);

      expect(() => request('GET', '/api/foo')).to.throw();
      expect(request('GET', '/foo')).to.equal(200);
    });

    it('can be scoped to multiple namespaces', function() {
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
});
