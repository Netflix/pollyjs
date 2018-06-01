import buildUrl from '../../../src/utils/build-url';

describe('Unit | Utils | buildUrl', function() {
  it('should exist', function() {
    expect(buildUrl).to.be.a('function');
  });

  it('should remove consecutive slashes', function() {
    expect(buildUrl('http://foo.com///bar/baz/')).to.equal(
      'http://foo.com/bar/baz/'
    );
  });

  it('should remove empty fragments of the url', function() {
    expect(buildUrl('http://foo///bar/////baz')).to.equal('http://foo/bar/baz');
  });

  it('should remove empty fragments of the url', function() {
    expect(buildUrl('/foo/bar/baz')).to.equal(`${location.origin}/foo/bar/baz`);
  });

  it('should concat multiple paths together', function() {
    expect(buildUrl('/foo', '/bar', null, undefined, false, '/baz')).to.equal(
      `${location.origin}/foo/bar/baz`
    );
  });
});
