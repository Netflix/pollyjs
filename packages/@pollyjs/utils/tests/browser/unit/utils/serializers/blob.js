import File from '@pollyjs-tests/helpers/file';

import { serialize } from '../../../../../src/utils/serializers/blob';
import serializerTests from '../../../../serializer-tests';

describe('Unit | Utils | Serializers | blob', function () {
  serializerTests(serialize);

  it('should noop if Blob is not found', function () {
    const Blob = Blob;
    const blob = new Blob(['blob'], { type: 'text/plain' });

    global.Blob = undefined;
    expect(serialize(blob)).to.be.equal(blob);
    global.Blob = Blob;
  });

  it('should handle blobs', async function () {
    expect(
      await serialize(new Blob(['blob'], { type: 'text/plain' }))
    ).to.equal(`data:text/plain;base64,${btoa('blob')}`);
  });

  it('should handle files', async function () {
    expect(
      await serialize(
        new File(['file'], 'file.txt', {
          type: 'text/plain'
        })
      )
    ).to.equal(`data:text/plain;base64,${btoa('file')}`);
  });
});
