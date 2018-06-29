import HAR from '../../src/har';
import Log from '../../src/har/log';
import Entry from '../../src/har/entry';
import Request from '../../src/har/request';
import Response from '../../src/har/response';
import * as validate from 'har-validator/lib/async';

describe('Unit | HAR', function() {
  it('should exist', function() {
    expect(HAR).to.be.a('function');
    expect(Log).to.be.a('function');
    expect(Entry).to.be.a('function');
    expect(Request).to.be.a('function');
    expect(Response).to.be.a('function');
  });

  describe('Log', function() {
    it('should merge passed options', async function() {
      expect(new Log({ foo: 'foo' })).to.deep.include({ foo: 'foo' });
    });

    it('should require creator', async function() {
      expect(await validate.log(new Log())).to.be.false;
    });

    it('should be valid', async function() {
      expect(await validate.log(new Log({
        creator: { name: 'Polly.JS', version: '0.0.0' }
      }))).to.be.true;
    });
  });
});
