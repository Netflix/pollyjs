import timestamp from '../../../src/utils/timestamp';

describe('Unit | Utils | timestamp', function() {
  it('should exist', function() {
    expect(timestamp).to.be.a('function');
  });

  it('should return a string', function() {
    expect(timestamp()).to.be.a('string');
  });
});
