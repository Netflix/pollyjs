import URL from '../../../src/utils/url';

describe('Unit | Utils | URL', function() {
  it('should exist', function() {
    expect(URL).to.be.a('function');
  });

  it('should work', function() {
    expect(new URL('http://netflix.com').href).to.equal('http://netflix.com');
  });

  it('should should not parse the query string by default', function() {
    expect(new URL('http://netflix.com?foo=bar').query).to.equal('?foo=bar');
  });

  it('should correctly parse query params', function() {
    [
      ['foo=bar', { foo: 'bar' }],
      ['a[]=1&a[]=2', { a: ['1', '2'] }],
      ['a[1]=1&a[0]=2', { a: ['2', '1'] }],
      ['a=1&a=2', { a: ['1', '2'] }],
      ['foo[bar][baz]=1', { foo: { bar: { baz: '1' } } }]
    ].forEach(([query, obj]) => {
      expect(new URL(`http://foo.bar?${query}`, true).query).to.deep.equal(obj);
    });
  });

  it('should correctly stringify query params', function() {
    [
      [{ foo: 'bar' }, 'foo=bar'],
      [{ a: ['1', '2'] }, 'a[0]=1&a[1]=2'],
      [{ foo: { bar: { baz: '1' } } }, 'foo[bar][baz]=1']
    ].forEach(([obj, query]) => {
      const url = new URL('http://foo.bar', true);

      url.set('query', obj);
      expect(decodeURIComponent(url.href.split('?')[1])).to.equal(query);
      expect(decodeURIComponent(url.toString().split('?')[1])).to.equal(query);
    });
  });
});
