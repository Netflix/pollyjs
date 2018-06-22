import serializeRequestBody from '../../../src/utils/serialize-request-body';
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
    expect(await serializeRequestBody(new Blob(['blob']))).to.equal(
      btoa('blob')
    );
  });

  it('should handle files', async function() {
    expect(await serializeRequestBody(new File(['file'], 'file.txt'))).to.equal(
      btoa('file')
    );
  });

  it('should handle form-data', async function() {
    const formData = new FormData();

    formData.append('string', 'string');
    formData.append('array', [1, 2]);
    formData.append('blob', new Blob(['blob']));
    formData.append('file', new File(['file'], 'file.txt'));

    const json = JSON.parse(await serializeRequestBody(formData));

    expect(json.string).to.equal('string');
    expect(json.array).to.equal('1,2');
    expect(json.blob).to.equal(btoa('blob'));
    expect(json.file).to.equal(btoa('file'));
  });
});
