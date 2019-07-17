import { PollyError, timeout } from '@pollyjs/utils';

import EventEmitter from '../../../src/-private/event-emitter';

let emitter;

function assertEventName(methodName) {
  expect(() => emitter[methodName]()).to.throw(
    PollyError,
    /Invalid event name provided. Expected string/
  );
  expect(() => emitter[methodName]('invalid')).to.throw(
    PollyError,
    /Possible events: a, b/
  );
}

function assertListener(methodName) {
  expect(() => emitter[methodName]('a')).to.throw(
    PollyError,
    /Invalid listener provided/
  );
}

describe('Unit | EventEmitter', function() {
  it('should exist', function() {
    expect(() => new EventEmitter({ eventNames: ['a'] })).to.not.throw();
    expect(new EventEmitter({ eventNames: ['a'] })).to.exist;
  });

  it('should throw without eventNames', function() {
    expect(() => new EventEmitter()).to.throw(PollyError);
    expect(() => new EventEmitter({ eventNames: [] })).to.throw(
      PollyError,
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

    it('.on(listener, { times })', async function() {
      assertEventName('on');
      assertListener('on');

      let listenerCalled = 0;
      const listener = () => listenerCalled++;

      expect(() => emitter.on('a', listener, { times: '1' })).to.throw(
        PollyError,
        /Invalid number provided/
      );

      expect(() => emitter.on('a', listener, { times: -1 })).to.throw(
        PollyError,
        /The number must be greater than 0/
      );

      emitter.on('a', listener, { times: 1 });
      emitter.on('a', listener, { times: 2 });
      expect(emitter.listeners('a')).to.have.lengthOf(1);

      await emitter.emit('a');
      await emitter.emit('a');
      await emitter.emit('a');

      expect(listenerCalled).to.equal(2);
      expect(emitter.listeners('a')).to.have.lengthOf(0);
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

      emitter.once('a', listener);
      expect(emitter.listeners('a')).to.have.lengthOf(1);

      emitter.off('a', listener);
      expect(emitter.listeners('a')).to.have.lengthOf(0);
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

      emitter.on('a', listener, { times: 3 });
      expect(emitter.listeners('a')).to.have.lengthOf(1);

      emitter.off('a', listener);
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

    it('.emit() - stopPropagation', async function() {
      const array = [];

      emitter.on('a', async e => {
        e.stopPropagation();
        array.push(1);
      });
      emitter.on('a', () => array.push(2));

      expect(await emitter.emit('a')).to.be.false;
      expect(array).to.have.ordered.members([1]);
    });

    it('.emitParallel()', async function() {
      expect(emitter.emitParallel('a')).to.be.a('promise');

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

    it('.emitParallel() - stopPropagation', async function() {
      const array = [];

      emitter.on('a', async e => {
        e.stopPropagation();
        array.push(1);
      });
      emitter.on('a', () => array.push(2));

      expect(await emitter.emitParallel('a')).to.be.false;
      expect(array).to.have.ordered.members([1, 2]);
    });

    it('.emitSync()', async function() {
      emitter.once('a', () => Promise.resolve());
      expect(() => emitter.emitSync('a')).to.throw(
        PollyError,
        /Attempted to emit a synchronous event/
      );

      const array = [];

      emitter.on('a', () => array.push(1));
      emitter.on('a', () => array.push(2));
      emitter.on('a', () => array.push(3));

      expect(emitter.emitSync('a')).to.be.true;
      expect(array).to.have.ordered.members([1, 2, 3]);
    });

    it('.emitSync() - stopPropagation', async function() {
      const array = [];

      emitter.on('a', e => {
        e.stopPropagation();
        array.push(1);
      });
      emitter.on('a', () => array.push(2));

      expect(emitter.emitSync('a')).to.be.false;
      expect(array).to.have.ordered.members([1]);
    });
  });
});
