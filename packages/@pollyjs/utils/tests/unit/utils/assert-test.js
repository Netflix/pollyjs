import assert from '../../../src/utils/assert';
import PollyError from '../../../src/utils/polly-error';

describe('Unit | Utils | assert', function () {
  it('should exist', function () {
    expect(assert).to.be.a('function');
  });

  it('should throw with a false condition', function () {
    expect(() => assert('Test', false)).to.throw(PollyError, /Test/);
  });

  it('should throw without a condition', function () {
    expect(() => assert('Test')).to.throw(PollyError, /Test/);
  });

  it('should not throw with a true condition', function () {
    expect(() => assert('Test', true)).to.not.throw();
  });
});
