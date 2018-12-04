import mergeChunks from '../../../src/utils/merge-chunks';

describe('Unit | Utils | mergeChunks', function() {
  it('should exist', function() {
    expect(mergeChunks).to.be.a('function');
  });

  it('should work', function() {
    [null, []].forEach(chunks => {
      const buffer = mergeChunks(chunks);

      expect(Buffer.isBuffer(buffer)).to.be.true;
      expect(buffer.toString()).to.have.lengthOf(0);
    });

    const str = mergeChunks(['T', 'e', 's', 't']);

    expect(Buffer.isBuffer(str)).to.be.false;
    expect(str).to.equal('Test');

    const buffer = mergeChunks(['T', 'e', 's', 't'].map(c => Buffer.from(c)));

    expect(Buffer.isBuffer(buffer)).to.be.true;
    expect(buffer.toString()).to.equal('Test');
  });
});
