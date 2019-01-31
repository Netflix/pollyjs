import stringify from 'fast-json-stable-stringify';

import HTTPBase from '../../../src/-private/http-base';

let base;

describe('Unit | HTTPBase', function() {
  it('should exist', function() {
    expect(() => new HTTPBase()).to.not.throw();
    expect(new HTTPBase()).to.exist;
  });

  describe('API', function() {
    beforeEach(function() {
      base = new HTTPBase();
    });

    it('.getHeader()', function() {
      const { headers } = base;

      base.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      expect(base.getHeader('One')).to.equal('1');
      expect(base.getHeader('one')).to.equal('1');
      expect(base.getHeader('Two')).to.be.undefined;

      base.removeHeader('One');
      expect(base.getHeader('One')).to.be.undefined;
      expect(base.getHeader('one')).to.be.undefined;
    });

    it('.hasHeader()', function() {
      const { headers } = base;

      base.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      expect(base.hasHeader('One')).to.be.true;
      expect(base.hasHeader('one')).to.be.true;
      expect(base.hasHeader('Two')).to.be.false;

      base.removeHeader('One');
      expect(base.hasHeader('One')).to.be.false;
      expect(base.hasHeader('one')).to.be.false;
    });

    it('.setHeader()', function() {
      const { headers } = base;

      base.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      base.setHeader('two', '2');
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      base.setHeader('Two', null);
      expect(headers).to.deep.equal({ one: '1' });
    });

    it('.setHeaders()', function() {
      const { headers } = base;

      base.setHeaders({ One: '1', two: '2' });
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      base.setHeaders({ Three: '3' });
      expect(headers).to.deep.equal({ one: '1', two: '2', three: '3' });

      base.setHeaders({ Three: null });
      expect(headers).to.deep.equal({ one: '1', two: '2' });
    });

    it('.removeHeader()', function() {
      const { headers } = base;

      base.setHeaders({ One: '1', Two: '2' });

      base.removeHeader('One');
      expect(headers).to.deep.equal({ two: '2' });

      base.removeHeader('two');
      expect(headers).to.deep.equal({});
    });

    it('.removeHeaders()', function() {
      const { headers } = base;

      base.setHeaders({ One: '1', Two: '2' });

      base.removeHeaders(['One', 'two']);
      expect(headers).to.deep.equal({});
    });

    it('.type()', function() {
      base.type('text/plain');
      expect(base.getHeader('Content-Type')).to.equal('text/plain');
    });

    it('.send() - string', function() {
      base.send('foo');

      expect(base.body).to.equal('foo');
      expect(base.getHeader('Content-Type')).to.equal(
        'text/html; charset=utf-8'
      );
    });

    it('.send() - boolean, number, & object', function() {
      [true, 200, {}].forEach(body => {
        base.type();
        base.send(body);

        expect(base.body).to.equal(stringify(body));
        expect(base.getHeader('Content-Type')).to.equal(
          'application/json; charset=utf-8'
        );
      });
    });

    it('.send() - null & undefined', function() {
      base.type();
      base.send(null);
      expect(base.body).to.equal('');
      expect(base.hasHeader('Content-Type')).to.be.false;

      base.type();
      base.send();
      expect(base.body).to.be.undefined;
      expect(base.hasHeader('Content-Type')).to.be.false;
    });

    it('.send() - should not override existing type', function() {
      base.type('text/plain; charset=utf-9000');
      base.send('foo');

      expect(base.body).to.equal('foo');
      expect(base.getHeader('Content-Type')).to.equal(
        'text/plain; charset=utf-9000'
      );
    });

    it('.json()', function() {
      const obj = { foo: 'bar' };

      base.json(obj);

      expect(base.body).to.equal(stringify(obj));
      expect(base.getHeader('Content-Type')).to.equal(
        'application/json; charset=utf-8'
      );
    });

    it('.json() - should not override existing type', function() {
      const obj = { foo: 'bar' };

      base.type('text/plain; charset=utf-9000');
      base.send(obj);

      expect(base.body).to.equal(stringify(obj));
      expect(base.getHeader('Content-Type')).to.equal(
        'text/plain; charset=utf-9000'
      );
    });

    it('.jsonBody()', function() {
      const obj = { foo: 'bar' };

      expect(() => base.jsonBody()).to.throw(Error);

      base.json(obj);
      expect(base.jsonBody()).to.deep.equal(obj);
    });

    it('.end()', function() {
      base.setHeader('foo', 'bar');

      expect(base.headers).to.deep.equal({ foo: 'bar' });

      base.end();
      expect(() => base.setHeader('bar', 'baz')).to.throw();
      expect(base.headers).to.deep.equal({ foo: 'bar' });
    });

    it('should be chainable', function() {
      expect(base.setHeader('one', '1')).to.equal(base);
      expect(base.setHeaders({ one: '1' })).to.equal(base);
      expect(base.type('text/plain')).to.equal(base);
      expect(base.send('body')).to.equal(base);
      expect(base.json({ foo: 'bar' })).to.equal(base);
      expect(base.end()).to.equal(base);
    });
  });
});
