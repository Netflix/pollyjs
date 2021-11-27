import URL from '../../../src/utils/url';

const encode = encodeURIComponent;
const decode = decodeURIComponent;

describe('Unit | Utils | URL', function () {
  it('should exist', function () {
    expect(URL).to.be.a('function');
  });

  it('should work', function () {
    expect(new URL('http://netflix.com').href).to.equal('http://netflix.com');
  });

  it('should should not parse the query string by default', function () {
    expect(new URL('http://netflix.com?foo=bar').query).to.equal('?foo=bar');
  });

  it('should correctly parse query params', function () {
    [
      ['', {}],
      ['a&b=', { a: null, b: '' }],
      ['foo=bar', { foo: 'bar' }],
      ['a[]=1&a[]=2', { a: ['1', '2'] }],
      ['a[1]=1&a[0]=2', { a: ['2', '1'] }],
      ['a=1&a=2', { a: ['1', '2'] }],
      ['foo[bar][baz]=1', { foo: { bar: { baz: '1' } } }]
    ].forEach(([query, obj]) => {
      expect(new URL(`http://foo.bar?${query}`, true).query).to.deep.equal(obj);
    });
  });

  it('should correctly stringify query params', function () {
    [
      // Query string will be undefined but we decode it in the assertion
      [{}, decode(undefined)],
      [{ a: null, b: '' }, 'a&b='],
      [{ foo: 'bar' }, 'foo=bar'],
      [{ a: ['1', '2'] }, 'a[0]=1&a[1]=2'],
      [{ foo: { bar: { baz: '1' } } }, 'foo[bar][baz]=1']
    ].forEach(([obj, query]) => {
      const url = new URL('http://foo.bar', true);

      url.set('query', obj);
      expect(decode(url.href.split('?')[1])).to.equal(query);
      expect(decode(url.toString().split('?')[1])).to.equal(query);
    });
  });

  it('should correctly detect original array formats', function () {
    [
      'a[0]=1&a[1]=2',
      `${encode('a[0]')}=1&${encode('a[1]')}=2`,
      'a[]=1&a[]=2',
      `${encode('a[]')}=1&${encode('a[]')}=2`,
      'a=1&a=2'
    ].forEach((query) => {
      const url = new URL(`http://foo.bar?${query}`, true);

      expect(decode(url.href.split('?')[1])).to.equal(decode(query));
      expect(decode(url.toString().split('?')[1])).to.equal(decode(query));
    });
  });

  it('should correctly handle changes in array formats', function () {
    const url = new URL(`http://foo.bar`, true);

    ['a[0]=1&a[1]=2', 'a[]=1&a[]=2', 'a=1&a=2'].forEach((query) => {
      url.set('query', query);

      expect(decode(url.href.split('?')[1])).to.equal(query);
      expect(decode(url.toString().split('?')[1])).to.equal(query);
    });
  });
});
