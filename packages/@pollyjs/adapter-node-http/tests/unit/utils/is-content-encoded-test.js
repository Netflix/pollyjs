import isContentEncoded from '../../../src/utils/is-content-encoded';

describe('Unit | Utils | isContentEncoded', function() {
  it('should exist', function() {
    expect(isContentEncoded).to.be.a('function');
  });

  it('should work', function() {
    [
      [null, false],
      [{}, false],
      [{ 'content-encoding': '' }, false],
      [{ 'content-encoding': 'gzip' }, true],
      [{ 'content-encoding': 'gzip, deflate' }, true]
    ].forEach(([headers, value]) =>
      expect(isContentEncoded(headers)).to.equal(value)
    );
  });
});
