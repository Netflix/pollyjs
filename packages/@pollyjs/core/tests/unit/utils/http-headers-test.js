import HTTPHeaders from '../../../src/utils/http-headers';

const { keys } = Object;

describe('Unit | Utils | HTTPHeaders', function () {
  it('should exist', function () {
    expect(HTTPHeaders).to.be.a('function');
  });

  it('should be instantiable', function () {
    expect(new HTTPHeaders()).to.be.an('object');
  });

  it('can be constructed with defaults', function () {
    expect(new HTTPHeaders({ A: 'a', b: 'b' })).to.deep.equal({
      a: 'a',
      b: 'b'
    });
  });

  it('should lower-case keys', function () {
    const headers = new HTTPHeaders();

    headers['Content-Type'] = 'application/json';

    expect(headers['content-type']).to.equal('application/json');
    expect(headers['Content-Type']).to.equal('application/json');
    expect(headers['CONTENT-TYPE']).to.equal('application/json');
  });

  it('should allow an empty header value', function () {
    const headers = new HTTPHeaders();

    headers['Content-Type'] = '';

    expect(headers['Content-Type']).to.equal('');
  });

  it('should delete header regardless of case', function () {
    const headers = new HTTPHeaders();

    headers['Content-Type'] = 'application/json';
    expect(keys(headers)).to.deep.equal(['content-type']);

    delete headers['Content-Type'];
    expect(keys(headers)).to.deep.equal([]);

    headers['Content-Type'] = 'application/json';
    expect(keys(headers)).to.deep.equal(['content-type']);

    delete headers['CONTENT-TYPE'];
    expect(keys(headers)).to.deep.equal([]);
  });

  it('should delete header when set with a null/undefined value', function () {
    const headers = new HTTPHeaders();

    headers['Content-Type'] = 'application/json';
    expect(keys(headers)).to.deep.equal(['content-type']);

    headers['Content-Type'] = null;
    expect(keys(headers)).to.deep.equal([]);

    headers['Content-Type'] = 'application/json';
    expect(keys(headers)).to.deep.equal(['content-type']);

    headers['Content-Type'] = undefined;
    expect(keys(headers)).to.deep.equal([]);
  });

  it('should handle a non string getter', function () {
    const headers = new HTTPHeaders();

    expect(() => headers[Symbol()]).to.not.throw();
  });

  it('should not allow setting a non string header key', function () {
    const headers = new HTTPHeaders();

    expect(() => (headers[Symbol()] = 'Foo')).to.throw(TypeError);
  });

  it('should not allow deleting a non string header key', function () {
    const headers = new HTTPHeaders();

    expect(() => delete headers[Symbol()]).to.throw(TypeError);
  });
});
