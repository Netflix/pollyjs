import serializeRequestBody from '../../../../src/utils/serialize-request-body';
import File from '../../helpers/file';

describe('Unit | Utils | serializeRequestBody', function() {
  it('should exist', function() {
    expect(serializeRequestBody).to.be.a('function');
  });

  it('should handle empty argument', async function() {
    expect(await serializeRequestBody()).to.be.undefined;
    expect(await serializeRequestBody(null)).to.be.null;
  });

  it('should handle strings', async function() {
    expect(await serializeRequestBody('')).to.be.equal('');
    expect(await serializeRequestBody('foo')).to.be.equal('foo');
  });

  it('should handle blobs', async function() {
    expect(
      await serializeRequestBody(new Blob(['blob'], { type: 'text/plain' }))
    ).to.equal(`data:text/plain;base64,${btoa('blob')}`);
  });

  it('should handle files', async function() {
    expect(await serializeRequestBody(new File(['file'], 'file.txt'))).to.equal(
      `data:;base64,${btoa('file')}`
    );
  });

  it('should handle form-data', async function() {
    const formData = new FormData();

    formData.append('string', 'string');
    formData.append('array', [1, 2]);
    formData.append('blob', new Blob(['blob']));
    formData.append('file', new File(['file'], 'file.txt'));

    const data = await serializeRequestBody(formData);

    expect(data).to.include('string=string');
    expect(data).to.include('array=1,2');
    expect(data).to.include(`blob=data:;base64,${btoa('blob')}`);
    expect(data).to.include(`file=data:;base64,${btoa('file')}`);
  });
});
