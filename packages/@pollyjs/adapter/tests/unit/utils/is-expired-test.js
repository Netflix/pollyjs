import isExpired from '../../../src/utils/is-expired';

describe('Unit | Utils | isExpired', function() {
  it('should exist', function() {
    expect(isExpired).to.be.a('function');
  });

  it('should work', function() {
    [
      [undefined, undefined, false],
      [null, null, false],
      [new Date(), undefined, false],
      [undefined, '1 day', false],
      [new Date(), '1 day', false],
      [new Date('1/1/2018'), '100 years', false],
      [new Date('1/1/2017'), '1y', true],
      [new Date('1/1/2018'), '1m5d10h', true]
    ].forEach(([recordedOn, expiresIn, value]) => {
      expect(isExpired(recordedOn, expiresIn)).to.equal(value);
    });
  });
});
