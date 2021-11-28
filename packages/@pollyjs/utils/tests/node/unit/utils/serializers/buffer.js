/* eslint-env node */

import { serialize } from '../../../../../src/utils/serializers/buffer';
import serializerTests from '../../../../serializer-tests';

describe('Unit | Utils | Serializers | buffer', function () {
  serializerTests(serialize);

  it('should noop if Buffer is not found', function () {
    const Buffer = Buffer;
    const buffer = Buffer.from('buffer');

    global.Buffer = undefined;
    expect(serialize(buffer)).to.be.equal(buffer);
    global.Buffer = Buffer;
  });

  it('should handle buffers', function () {
    const buffer = Buffer.from('buffer');

    expect(serialize(buffer)).to.equal(buffer.toString('base64'));
  });

  it('should handle array of buffers', function () {
    const buffers = [Buffer.from('b1'), Buffer.from('b2')];

    expect(serialize(buffers)).to.include(buffers[0].toString('base64'));
    expect(serialize(buffers)).to.include(buffers[1].toString('base64'));
  });

  it('should handle a mixed array of buffers and strings', function () {
    const buffers = [Buffer.from('b1'), 's1'];

    expect(serialize(buffers)).to.include(buffers[0].toString('base64'));
    expect(serialize(buffers)).to.include(
      Buffer.from(buffers[1]).toString('base64')
    );
  });

  it('should handle an ArrayBuffer', function () {
    const buffer = new ArrayBuffer(8);

    expect(serialize(buffer)).to.equal(Buffer.from(buffer).toString('base64'));
  });

  it('should handle an ArrayBufferView', function () {
    const buffer = new Uint8Array(8);

    expect(serialize(buffer)).to.equal(
      Buffer.from(buffer, buffer.byteOffset, buffer.byteLength).toString(
        'base64'
      )
    );
  });
});
