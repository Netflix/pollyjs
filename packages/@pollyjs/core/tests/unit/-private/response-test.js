import PollyResponse from '../../../src/-private/response';

let response;

describe('Unit | Response', function() {
  it('should exist', function() {
    expect(() => new PollyResponse()).to.not.throw();
    expect(new PollyResponse()).to.exist;
  });

  it('should have a default status code of 200', function() {
    expect(new PollyResponse().statusCode).to.equal(200);
  });

  describe('API', function() {
    beforeEach(function() {
      response = new PollyResponse();
    });

    it('.status()', function() {
      [100, '404', 500, '599'].forEach(statusCode => {
        expect(response.status(statusCode).statusCode).to.equal(
          Number(statusCode)
        );
      });

      [null, '', 0, 99, 600, 999].forEach(statusCode => {
        expect(() => response.status(statusCode)).to.throw(
          Error,
          /Invalid status code/
        );
      });
    });

    it('.sendStatus()', function() {
      response.sendStatus(200);

      expect(response.body).to.equal('200');
      expect(response.getHeader('Content-Type')).to.equal(
        'text/plain; charset=utf-8'
      );
    });

    it('.end()', function() {
      response.status(200);
      response.setHeader('foo', 'bar');

      expect(response.statusCode).to.equal(200);
      expect(response.headers).to.deep.equal({ foo: 'bar' });

      response.end();
      expect(() => response.status(404)).to.throw();
      expect(() => response.setHeader('bar', 'baz')).to.throw();

      expect(response.statusCode).to.equal(200);
      expect(response.headers).to.deep.equal({ foo: 'bar' });
    });

    it('should be chainable', function() {
      expect(response.status(200)).to.equal(response);
      expect(response.type('text/plain')).to.equal(response);
      expect(response.send('body')).to.equal(response);
      expect(response.sendStatus(200)).to.equal(response);
      expect(response.json({ foo: 'bar' })).to.equal(response);
    });
  });
});
