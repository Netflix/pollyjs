import PollyResponse from '../../../src/-private/response';

const { stringify } = JSON;
let response;

describe('Unit | Response', function() {
  it('should exist', function() {
    expect(() => new PollyResponse()).to.not.throw();
    expect(new PollyResponse()).to.exist;
  });

  describe('API', function() {
    beforeEach(function() {
      response = new PollyResponse();
    });

    it('.status()', function() {
      response.status(200);
      expect(response.statusCode).to.equal(200);

      response.status('400');
      expect(response.statusCode).to.equal(400);
    });

    it('.getHeader()', function() {
      const { headers } = response;

      response.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      expect(response.getHeader('One')).to.equal('1');
      expect(response.getHeader('one')).to.equal('1');
      expect(response.getHeader('Two')).to.be.undefined;

      response.setHeader('One', '');
      expect(response.getHeader('One')).to.be.undefined;
      expect(response.getHeader('one')).to.be.undefined;
    });

    it('.hasHeader()', function() {
      const { headers } = response;

      response.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      expect(response.hasHeader('One')).to.be.true;
      expect(response.hasHeader('one')).to.be.true;
      expect(response.hasHeader('Two')).to.be.false;

      response.setHeader('One', '');
      expect(response.hasHeader('One')).to.be.false;
      expect(response.hasHeader('one')).to.be.false;
    });

    it('.setHeader()', function() {
      const { headers } = response;

      response.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      response.setHeader('two', '2');
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      response.setHeader('Two', '');
      expect(headers).to.deep.equal({ one: '1' });
    });

    it('.setHeaders()', function() {
      const { headers } = response;

      response.setHeaders({ One: '1', two: '2' });
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      response.setHeaders({ Three: '3' });
      expect(headers).to.deep.equal({ one: '1', two: '2', three: '3' });

      response.setHeaders({ Three: '' });
      expect(headers).to.deep.equal({ one: '1', two: '2' });
    });

    it('.type()', function() {
      response.type('text/plain');
      expect(response.getHeader('Content-Type')).to.equal('text/plain');
    });

    it('.send() - string', function() {
      response.send('foo');

      expect(response.body).to.equal('foo');
      expect(response.getHeader('Content-Type')).to.equal(
        'text/html; charset=utf-8'
      );
    });

    it('.send() - boolean, number, & object', function() {
      [true, 200, {}].forEach(body => {
        response.type();
        response.send(body);

        expect(response.body).to.equal(stringify(body));
        expect(response.getHeader('Content-Type')).to.equal(
          'application/json; charset=utf-8'
        );
      });
    });

    it('.send() - null & undefined', function() {
      response.type();
      response.send(null);
      expect(response.body).to.equal('');
      expect(response.hasHeader('Content-Type')).to.be.false;

      response.type();
      response.send();
      expect(response.body).to.be.undefined;
      expect(response.hasHeader('Content-Type')).to.be.false;
    });

    it('.send() - should not override existing type', function() {
      response.type('text/plain; charset=utf-9000');
      response.send('foo');

      expect(response.body).to.equal('foo');
      expect(response.getHeader('Content-Type')).to.equal(
        'text/plain; charset=utf-9000'
      );
    });

    it('.sendStatus()', function() {
      response.sendStatus(200);

      expect(response.body).to.equal('200');
      expect(response.getHeader('Content-Type')).to.equal(
        'text/plain; charset=utf-8'
      );
    });

    it('.json()', function() {
      const obj = { foo: 'bar' };

      response.json(obj);

      expect(response.body).to.equal(stringify(obj));
      expect(response.getHeader('Content-Type')).to.equal(
        'application/json; charset=utf-8'
      );
    });

    it('.json() - should not override existing type', function() {
      const obj = { foo: 'bar' };

      response.type('text/plain; charset=utf-9000');
      response.send(obj);

      expect(response.body).to.equal(stringify(obj));
      expect(response.getHeader('Content-Type')).to.equal(
        'text/plain; charset=utf-9000'
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
      expect(response.setHeader('one', '1')).to.equal(response);
      expect(response.setHeaders({ one: '1' })).to.equal(response);
      expect(response.type('text/plain')).to.equal(response);
      expect(response.send('body')).to.equal(response);
      expect(response.sendStatus(200)).to.equal(response);
      expect(response.json({ foo: 'bar' })).to.equal(response);
      expect(response.end()).to.equal(response);
    });
  });
});
