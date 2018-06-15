import assert from '../../../src/utils/assert';

describe('Unit | Utils | assert', function() {
  it('should exist', function() {
    expect(assert).to.be.a('function');
  });

  it('should throw with a false condition', function() {
    expect(() => assert('Test', false)).to.throw(Error, '[Polly] Test');
  });

  it('should not throw with a true condition', function() {
    expect(() => assert('Test', true)).to.not.throw();
  });
});
