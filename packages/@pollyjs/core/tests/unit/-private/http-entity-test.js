import HTTPEntity from '../../../src/-private/http-entity';

let entity;

describe('Unit | HTTPEntity', function() {
  it('should exist', function() {
    expect(() => new HTTPEntity()).to.not.throw();
    expect(new HTTPEntity()).to.exist;
  });

  describe('API', function() {
    beforeEach(function() {
      entity = new HTTPEntity();
    });

    it('.getHeader()', function() {
      const { headers } = entity;

      entity.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      expect(entity.getHeader('One')).to.equal('1');
      expect(entity.getHeader('one')).to.equal('1');
      expect(entity.getHeader('Two')).to.be.undefined;

      entity.setHeader('One', '');
      expect(entity.getHeader('One')).to.be.undefined;
      expect(entity.getHeader('one')).to.be.undefined;
    });

    it('.hasHeader()', function() {
      const { headers } = entity;

      entity.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      expect(entity.hasHeader('One')).to.be.true;
      expect(entity.hasHeader('one')).to.be.true;
      expect(entity.hasHeader('Two')).to.be.false;

      entity.setHeader('One', '');
      expect(entity.hasHeader('One')).to.be.false;
      expect(entity.hasHeader('one')).to.be.false;
    });

    it('.setHeader()', function() {
      const { headers } = entity;

      entity.setHeader('One', '1');
      expect(headers).to.deep.equal({ one: '1' });

      entity.setHeader('two', '2');
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      entity.setHeader('Two', '');
      expect(headers).to.deep.equal({ one: '1' });
    });

    it('.setHeaders()', function() {
      const { headers } = entity;

      entity.setHeaders({ One: '1', two: '2' });
      expect(headers).to.deep.equal({ one: '1', two: '2' });

      entity.setHeaders({ Three: '3' });
      expect(headers).to.deep.equal({ one: '1', two: '2', three: '3' });

      entity.setHeaders({ Three: '' });
      expect(headers).to.deep.equal({ one: '1', two: '2' });
    });

    it('.end()', function() {
      entity.setHeader('foo', 'bar');

      expect(entity.headers).to.deep.equal({ foo: 'bar' });

      entity.end();
      expect(() => entity.setHeader('bar', 'baz')).to.throw();
      expect(entity.headers).to.deep.equal({ foo: 'bar' });
    });

    it('should be chainable', function() {
      expect(entity.setHeader('one', '1')).to.equal(entity);
      expect(entity.setHeaders({ one: '1' })).to.equal(entity);
      expect(entity.end()).to.equal(entity);
    });
  });
});
