import isBinaryBuffer from '../../../src/utils/is-binary-buffer';

describe('Unit | Utils | isBinaryBuffer', function() {
  it('should exist', function() {
    expect(isBinaryBuffer).to.be.a('function');
  });

  it('should work', function() {
    [
      [null, false],
      ['', false],
      [Buffer.alloc(0), false],
      [Buffer.from('Test'), false],
      [Buffer.from('Test', 'hex'), false],
      [Buffer.from('Test', 'base64'), true]
    ].forEach(([buffer, value]) =>
      expect(isBinaryBuffer(buffer)).to.equal(value)
    );
  });
});
