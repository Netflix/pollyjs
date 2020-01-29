import { parseBody } from '../../../src/utils/request-body';

const emptyHeaders = {};
const jsonHeaders = { 'content-type': 'application/json' };

describe('Unit | Utils | parseBody', function() {
  describe('Nullish values', function() {
    const nullValues = [null, undefined];

    nullValues.forEach(function(v) {
      it(`should leave ${v} unmodified`, function() {
        expect(parseBody(v, emptyHeaders)).to.equal(v);
      });
    });
  });

  describe('JSON values', function() {
    const jsonValues = [
      true,
      false,
      100,
      'abc',
      [1, 'abc'],
      { a: 1, b: 'abc' }
    ];

    jsonValues.forEach(function(v) {
      it(`should stringify ${v}`, function() {
        expect(parseBody(v, jsonHeaders)).to.equal(JSON.stringify(v));
      });
    });
  });

  describe('Buffer values', function() {
    const bufferValues = [Buffer.from([171]), Buffer.from([300, 200])];

    bufferValues.forEach(function(buffer) {
      const hex = buffer.toString('hex');

      it(`should parse ${hex} as a buffer`, function() {
        const result = parseBody(hex, emptyHeaders);

        for (let i = 0; i < result.length; i++) {
          expect(result[i]).to.equal(buffer[i]);
        }
      });
    });
  });
});
