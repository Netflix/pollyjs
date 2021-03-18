import {
  body,
  headers,
  method,
  url
} from '../../../src/utils/normalize-request';

describe('Unit | Utils | Normalize Request', function() {
  it('should exist', function() {
    expect(url).to.be.a('function');
    expect(body).to.be.a('function');
    expect(method).to.be.a('function');
    expect(headers).to.be.a('function');
  });

  describe('method', function() {
    it('should handle all verbs', function() {
      expect(method('get')).to.equal('GET');
      expect(method('put')).to.equal('PUT');
      expect(method('post')).to.equal('POST');
      expect(method('patch')).to.equal('PATCH');
      expect(method('delete')).to.equal('DELETE');
      expect(method('option')).to.equal('OPTION');
    });

    it('should support a custom fn', function() {
      expect(method('GET', m => m.toLowerCase())).to.equal('get');
    });

    it('should pass the correct arguments to the custom fn', function() {
      const req = {};

      method(
        'GET',
        (method, request) => {
          expect(method).to.equal('GET');
          expect(request).to.equal(req);

          return method;
        },
        req
      );
    });
  });

  describe('headers', function() {
    it('should lower-case all header keys', function() {
      expect(
        headers({
          Accept: 'foo',
          'Content-Type': 'Bar'
        })
      ).to.deep.equal({
        accept: 'foo',
        'content-type': 'Bar'
      });
    });

    it('should exclude specified headers', function() {
      expect(
        headers(
          {
            Accept: 'foo',
            test: 'test',
            'Content-Type': 'Bar'
          },
          { exclude: ['test', 'content-type'] }
        )
      ).to.deep.equal({ accept: 'foo' });
    });

    it('should support a custom fn', function() {
      expect(
        headers(
          {
            Accept: 'foo',
            test: 'test',
            'Content-Type': 'Bar'
          },
          headers => {
            delete headers.test;

            return headers;
          }
        )
      ).to.deep.equal({ accept: 'foo', 'content-type': 'Bar' });
    });

    it('should pass the correct arguments to the custom fn', function() {
      const req = {};
      const reqHeaders = { foo: 'foo' };

      headers(
        reqHeaders,
        (headers, request) => {
          expect(headers).to.deep.equal(reqHeaders);
          expect(request).to.equal(req);

          return headers;
        },
        req
      );
    });

    it('should not mutate the original headers in the custom fn', function() {
      const reqHeaders = { foo: 'bar' };

      expect(
        headers(reqHeaders, headers => {
          delete headers.foo;

          return headers;
        })
      ).to.deep.equal({});

      expect(reqHeaders).to.deep.equal({ foo: 'bar' });
    });
  });

  describe('url', function() {
    it('should sort query params', function() {
      expect(url('http://foo.com?b=1&c=1&a=1', {})).to.equal(
        'http://foo.com/?a=1&b=1&c=1'
      );
    });

    it('should respect `matchRequestsBy.url` config', function() {
      [
        [
          /* config options */
          'hash',
          /* input url */
          'http://hash-test.com?b=1&c=1&a=1#hello=world',
          /* expected when true */
          [true, 'http://hash-test.com/?a=1&b=1&c=1#hello=world'],
          /* expected when false */
          [false, 'http://hash-test.com/?a=1&b=1&c=1'],
          /* expected when custom fn */
          [
            h => h.replace('=', '!='),
            'http://hash-test.com/?a=1&b=1&c=1#hello!=world'
          ]
        ],
        [
          'protocol',
          'http://protocol-test.com',
          [true, 'http://protocol-test.com/'],
          [false, '//protocol-test.com/'],
          [p => p.replace('http', 'https'), 'https://protocol-test.com/']
        ],
        [
          'query',
          'http://query-test.com?b=1&c=1&a=1',
          [true, 'http://query-test.com/?a=1&b=1&c=1'],
          [false, 'http://query-test.com'],
          [q => ({ ...q, c: 2 }), 'http://query-test.com/?a=1&b=1&c=2']
        ],
        [
          'username',
          'https://username:password@username-test.com',
          [true, 'https://username:password@username-test.com'],
          [false, 'https://username-test.com'],
          [u => `${u}123`, 'https://username123:password@username-test.com']
        ],
        [
          'password',
          'https://username:password@password-test.com',
          [true, 'https://username:password@password-test.com'],
          [false, 'https://username@password-test.com'],
          [p => `${p}123`, 'https://username:password123@password-test.com']
        ],
        [
          'port',
          'https://port-test.com:8000',
          [true, 'https://port-test.com:8000'],
          [false, 'https://port-test.com'],
          [p => Number(p) + 1, 'https://port-test.com:8001']
        ],
        [
          'pathname',
          'https://pathname-test.com/bar/baz',
          [true, 'https://pathname-test.com/bar/baz'],
          [false, 'https://pathname-test.com'],
          [p => p.replace('bar', 'foo'), 'https://pathname-test.com/foo/baz']
        ]
      ].forEach(([rule, input, ...options]) => {
        options.forEach(([optionValue, expectedOutput]) => {
          expect(url(input, { [rule]: optionValue })).to.equal(expectedOutput);
        });
      });
    });

    it('should respect relative urls', function() {
      expect(url('/some/path')).to.equal('/some/path');
    });

    it('should support a custom fn', function() {
      expect(url('https://foo.bar', url => url.replace('bar', 'foo'))).to.equal(
        'https://foo.foo/'
      );
    });

    it('should pass the correct arguments to the custom fn', function() {
      const req = {};

      url(
        'https://foo.bar',
        (url, request) => {
          expect(url).to.deep.equal('https://foo.bar/');
          expect(request).to.equal(req);

          return url;
        },
        req
      );
    });

    it("should pass the correct arguments to the individual `matchRequestsBy.url` option's custom fn", function() {
      const req = {};

      url(
        'https://foo.bar',
        {
          protocol: (protocol, request) => {
            expect(protocol).to.deep.equal('https:');
            expect(request).to.equal(req);

            return protocol;
          }
        },
        req
      );
    });
  });

  describe('body', function() {
    it('should support a custom fn', function() {
      expect(body('foo', b => b.toUpperCase())).to.equal('FOO');
    });

    it('should pass the correct arguments to the custom fn', function() {
      const req = {};

      url(
        'body',
        (body, request) => {
          expect(body).to.deep.equal('body');
          expect(request).to.equal(req);

          return body;
        },
        req
      );
    });
  });
});
