import EventEmitter from '../../../src/-private/event-emitter';
import { timeout } from '@pollyjs/utils';

let emitter;

function assertEventName(methodName) {
  expect(() => emitter[methodName]()).to.throw(
    Error,
    /Invalid event name provided. Expected string/
  );
  expect(() => emitter[methodName]('invalid')).to.throw(
    Error,
    /Possible events: a, b/
  );
}

function assertListener(methodName) {
  expect(() => emitter[methodName]('a')).to.throw(
    Error,
    /Invalid listener provided/
  );
}

describe('Unit | EventEmitter', function() {
  it('should exist', function() {
    expect(() => new EventEmitter({ eventNames: ['a'] })).to.not.throw();
    expect(new EventEmitter({ eventNames: ['a'] })).to.exist;
  });

  it('should throw without eventNames', function() {
    expect(() => new EventEmitter()).to.throw(Error);
    expect(() => new EventEmitter({ eventNames: [] })).to.throw(
      Error,
      /supported events must be provided/
    );
  });

  describe('API', function() {
    beforeEach(function() {
      emitter = new EventEmitter({
        eventNames: ['a', 'b']
      });
    });

    it('.eventNames()', function() {
      const listener = () => {};

      expect(emitter.eventNames()).to.have.lengthOf(0);

      emitter.on('a', listener);
      emitter.on('b', listener);
      expect(emitter.eventNames()).to.have.ordered.members(['a', 'b']);

      emitter.off('a', listener);
      expect(emitter.eventNames()).to.have.ordered.members(['b']);
    });

    it('.on()', async function() {
      assertEventName('on');
      assertListener('on');

      let listenerCalled = 0;
      const listener = () => listenerCalled++;

      emitter.on('a', listener);
      emitter.on('a', listener);
      expect(emitter.listeners('a')).to.have.lengthOf(1);

      emitter.on('a', () => {});
      expect(emitter.listeners('a')).to.have.lengthOf(2);

      await emitter.emit('a');
      expect(listenerCalled).to.equal(1);
    });

    it('.once()', async function() {
      assertEventName('once');
      assertListener('once');

      let listenerCalled = 0;
      const listener = () => listenerCalled++;

      emitter.once('a', listener);
      expect(emitter.listeners('a')).to.have.lengthOf(1);

      await emitter.emit('a');
      expect(listenerCalled).to.equal(1);
      expect(emitter.listeners('a')).to.have.lengthOf(0);

      await emitter.emit('a');
      expect(listenerCalled).to.equal(1);
    });

    it('.off()', async function() {
      assertEventName('off');

      const listener = () => {};

      emitter.on('a', listener);
      emitter.on('a', () => {});
      emitter.on('a', () => {});
      expect(emitter.listeners('a')).to.have.lengthOf(3);

      emitter.off('a', listener);
      expect(emitter.listeners('a')).to.have.lengthOf(2);

      emitter.off('a');
      expect(emitter.listeners('a')).to.have.lengthOf(0);
    });

    it('.listeners()', async function() {
      assertEventName('listeners');

      expect(emitter.listeners('a')).to.be.an('array');
      expect(emitter.listeners('a')).to.deep.equal([]);

      emitter.on('a', () => {});
      emitter.on('b', () => {});
      emitter.on('b', () => {});
      expect(emitter.listeners('a')).to.be.an('array');
      expect(emitter.listeners('a')).to.have.lengthOf(1);
      expect(emitter.listeners('b')).to.have.lengthOf(2);

      emitter.off('b');
      expect(emitter.listeners('b')).to.be.an('array');
      expect(emitter.listeners('b')).to.have.lengthOf(0);
    });

    it('.hasListeners()', async function() {
      assertEventName('hasListeners');

      expect(emitter.hasListeners('a')).to.be.false;

      emitter.on('a', () => {});
      expect(emitter.hasListeners('a')).to.be.true;

      emitter.off('a');
      expect(emitter.hasListeners('a')).to.be.false;
    });

    it('.emit()', async function() {
      expect(emitter.emit('a')).to.be.a('promise');
      // No listeners should resolve to `false`
      expect(await emitter.emit('a')).to.be.false;

      const array = [];

      emitter.on('a', () => array.push(1));
      emitter.on('a', async () => {
        await timeout(10);
        array.push(2);
      });
      emitter.on('a', () => array.push(3));

      expect(await emitter.emit('a')).to.be.true;
      expect(array).to.have.ordered.members([1, 2, 3]);
    });

    it('.emitParallel()', async function() {
      expect(emitter.emitParallel('a')).to.be.a('promise');
      // No listeners should resolve to `false`
      expect(await emitter.emitParallel('a')).to.be.false;

      const array = [];

      emitter.on('a', () => array.push(1));
      emitter.on('a', async () => {
        await timeout(20);
        array.push(2);
      });
      emitter.on('a', async () => {
        await timeout(10);
        array.push(3);
      });

      expect(await emitter.emitParallel('a')).to.be.true;
      expect(array).to.have.ordered.members([1, 3, 2]);
    });
  });
});
