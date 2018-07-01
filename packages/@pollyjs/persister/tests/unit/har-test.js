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
      expect(
        await validate.log(
          new Log({
            creator: { name: 'Polly.JS', version: '0.0.0' }
          })
        )
      ).to.be.true;
    });

    it('addEntries: Entries should be unique & sorted', async function() {
      const now = new Date().getTime();
      const log = new Log({
        entries: [
          {
            _id: 'abc',
            _order: 0,
            startedDateTime: new Date(now),
            _new: false
          },
          {
            _id: 'def',
            _order: 0,
            startedDateTime: new Date(now + 10),
            _new: false
          }
        ]
      });

      log.addEntries([
        {
          _id: 'abc',
          _order: 0,
          startedDateTime: new Date(now + 100),
          _new: true
        },
        {
          _id: 'abc',
          _order: 1,
          startedDateTime: new Date(now + 105),
          _new: true
        },
        { _id: 'ghi', _order: 0, startedDateTime: new Date(now), _new: true }
      ]);

      expect(
        log.entries.map(({ _id, _order, _new }) => ({ _id, _order, _new }))
      ).to.include.deep.ordered.members([
        { _id: 'ghi', _order: 0, _new: true },
        { _id: 'def', _order: 0, _new: false },
        { _id: 'abc', _order: 0, _new: true },
        { _id: 'abc', _order: 1, _new: true }
      ]);
    });

    it('sortEntries: sorts by startedDateTime', async function() {
      const now = new Date().getTime();
      const log = new Log({
        entries: [
          { _id: 'd', startedDateTime: new Date(now + 15) },
          { _id: 'b', startedDateTime: new Date(now + 5) },
          { _id: 'a', startedDateTime: new Date(now + 0) },
          { _id: 'c', startedDateTime: new Date(now + 10) }
        ]
      });

      log.sortEntries();

      expect(log.entries.map(e => e._id)).to.have.deep.ordered.members([
        'a',
        'b',
        'c',
        'd'
      ]);
    });
  });
});
