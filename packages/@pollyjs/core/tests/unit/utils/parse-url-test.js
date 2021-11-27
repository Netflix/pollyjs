import parseUrl from '../../../src/utils/parse-url';

describe('Unit | Utils | parseUrl', function () {
  it('should exist', function () {
    expect(parseUrl).to.be.a('function');
  });

  it('should exactly match passed urls', function () {
    [
      '/movies/1',
      '//netflix.com/movies/1',
      'http://netflix.com/movies/1',
      'http://netflix.com/movies/1?sort=title&dir=asc'
    ].forEach((url) => expect(parseUrl(url).href).to.equal(url));
  });

  it('should passthrough arguments to url-parse', function () {
    // Passing true tells url-parse to transform the querystring into an object
    expect(parseUrl('/movies/1?sort=title&dir=asc', true).query).to.deep.equal({
      sort: 'title',
      dir: 'asc'
    });
  });
});
