import guidForRecording from '../../../src/utils/guid-for-recording';

describe('Unit | Utils | guidForRecording', function () {
  it('should exist', function () {
    expect(guidForRecording).to.be.a('function');
  });

  it('should remove illegal file system characters', function () {
    expect(guidForRecording(`'?<>\\:*|"`)).to.equal('_3218500777');
  });

  it('should create a guid for each segment of the name', function () {
    const name = guidForRecording(`foo!/bar%/baz..`);

    expect(name).to.equal('foo_2152783170/bar_567945773/baz_1682401886');
  });

  it('should trim name to 100 characters', function () {
    const name = guidForRecording(new Array(200).fill('A').join(''));

    expect(name.length).to.be.lte(100);
  });
});
