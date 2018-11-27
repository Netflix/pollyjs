export default function serializerTests(serialize) {
  it('should exist', function() {
    expect(serialize).to.be.a('function');
  });

  it('should handle empty argument', async function() {
    expect(await serialize()).to.be.undefined;
    expect(await serialize(null)).to.be.null;
  });

  it('should handle strings', async function() {
    expect(await serialize('')).to.be.equal('');
    expect(await serialize('foo')).to.be.equal('foo');
  });
}
