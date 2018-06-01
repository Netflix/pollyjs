import isObject from '../../../src/utils/is-object';

describe('Unit | Utils | isObject', function() {
  it('should exist', function() {
    expect(isObject).to.be.a('function');
  });

  it('should handle empty argument', function() {
    expect(isObject()).to.be.false;
  });

  it('should return false for non-object types', function() {
    [false, true, '', null, undefined].forEach(
      value => expect(isObject(value)).to.be.false
    );
  });

  it('should return true for object types', function() {
    [[], {}, Object.create(null)].forEach(
      value => expect(isObject(value)).to.be.true
    );
  });
});
