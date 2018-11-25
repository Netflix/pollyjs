import File from '@pollyjs-tests/helpers/file';

import serialize from '../../../../../src/utils/serializers/browser/request-body';

describe('Unit | Utils | BrowserSerializers | request-body', function() {
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

  it('should noop if Blob is not found', function() {
    const Blob = Blob;
    const blob = new Blob(['blob'], { type: 'text/plain' });

    global.Blob = undefined;
    expect(serialize(blob)).to.be.equal(blob);
    global.Blob = Blob;
  });

  it('should noop if FormData is not found', function() {
    const FormData = FormData;
    const formData = new FormData();

    global.FormData = undefined;
    expect(serialize(formData)).to.be.equal(formData);
    global.FormData = FormData;
  });

  it('should handle blobs', async function() {
    expect(
      await serialize(new Blob(['blob'], { type: 'text/plain' }))
    ).to.equal(`data:text/plain;base64,${btoa('blob')}`);
  });

  it('should handle files', async function() {
    expect(
      await serialize(
        new File(['file'], 'file.txt', {
          type: 'text/plain'
        })
      )
    ).to.equal(`data:text/plain;base64,${btoa('file')}`);
  });

  it('should handle form-data', async function() {
    const formData = new FormData();

    formData.append('string', 'string');
    formData.append('array', [1, 2]);
    formData.append('blob', new Blob(['blob'], { type: 'text/plain' }));
    formData.append(
      'file',
      new File(['file'], 'file.txt', { type: 'text/plain' })
    );

    const data = await serialize(formData);

    expect(data).to.include('string=string');
    expect(data).to.include('array=1,2');
    expect(data).to.include(`blob=data:text/plain;base64,${btoa('blob')}`);
    expect(data).to.include(`file=data:text/plain;base64,${btoa('file')}`);
  });
});
