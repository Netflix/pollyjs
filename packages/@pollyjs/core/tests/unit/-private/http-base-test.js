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

      base.setHeader('One', '');
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

      base.setHeader('One', '');
      expect(base.hasHeader('One')).to.be.false;
      expect(base.hasHeader('one')).to.be.false;
    });

    it('.setHeader()', function() {
      const { headers } = base;

      base.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      base.setHeader('two', '2');
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      base.setHeader('Two', '');
      expect(headers).to.deep.equal({ one: '1' });
    });

    it('.setHeaders()', function() {
      const { headers } = base;

      base.setHeaders({ One: '1', two: '2' });
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      base.setHeaders({ Three: '3' });
      expect(headers).to.deep.equal({ one: '1', two: '2', three: '3' });

      base.setHeaders({ Three: '' });
      expect(headers).to.deep.equal({ one: '1', two: '2' });
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
      expect(base.end()).to.equal(base);
    });
  });
});
