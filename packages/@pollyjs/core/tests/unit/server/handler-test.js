import Handler from '../../../src/server/handler';

describe('Unit | Server | Handler', function () {
  it('should exist', function () {
    expect(Handler).to.be.a('function');
  });

  describe('Events', function () {
    it('throws on registering an unknown event name', function () {
      expect(() => new Handler().on('unknownEventName')).to.throw(
        /Invalid event name provided/
      );
    });

    it('throws on un-registering an unknown event name', function () {
      expect(() => new Handler().off('unknownEventName')).to.throw(
        /Invalid event name provided/
      );
    });

    it('registers a known event via .on()', function () {
      const handler = new Handler();
      const { _eventEmitter: eventEmitter } = handler;

      expect(eventEmitter.hasListeners('request')).to.be.false;

      handler.on('request', () => {});
      expect(eventEmitter.hasListeners('request')).to.be.true;

      handler.on('request', () => {});
      expect(eventEmitter.listeners('request')).to.have.lengthOf(2);
    });

    it('registers a known event via .on() with { times }', function () {
      const handler = new Handler();
      const { _eventEmitter: eventEmitter } = handler;

      handler.on('request', () => {}, { times: 2 });
      expect(eventEmitter.hasListeners('request')).to.be.true;

      eventEmitter.emitSync('request');
      expect(eventEmitter.hasListeners('request')).to.be.true;

      eventEmitter.emitSync('request');
      expect(eventEmitter.hasListeners('request')).to.be.false;
    });

    it('registers a known event via .on() with .times()', function () {
      const handler = new Handler();
      const { _eventEmitter: eventEmitter } = handler;

      handler.times(2).on('request', () => {});
      expect(eventEmitter.hasListeners('request')).to.be.true;

      eventEmitter.emitSync('request');
      expect(eventEmitter.hasListeners('request')).to.be.true;

      eventEmitter.emitSync('request');
      expect(eventEmitter.hasListeners('request')).to.be.false;
    });

    it('registers a known event via .on() with .times() and override with { times }', function () {
      const handler = new Handler();
      const { _eventEmitter: eventEmitter } = handler;

      handler.times(2).on('request', () => {}, { times: 1 });
      expect(eventEmitter.hasListeners('request')).to.be.true;

      eventEmitter.emitSync('request');
      expect(eventEmitter.hasListeners('request')).to.be.false;
    });

    it('registers a known event via .once()', function () {
      const handler = new Handler();
      const { _eventEmitter: eventEmitter } = handler;

      expect(eventEmitter.hasListeners('request')).to.be.false;

      handler.once('request', () => {});
      expect(eventEmitter.hasListeners('request')).to.be.true;

      handler.once('request', () => {});
      expect(eventEmitter.listeners('request')).to.have.lengthOf(2);

      eventEmitter.emitSync('request');
      expect(eventEmitter.hasListeners('request')).to.be.false;
    });

    it('un-registers a known event via .off()', function () {
      const handler = new Handler();
      const { _eventEmitter: eventEmitter } = handler;
      const fn = () => {};

      handler.on('request', fn);
      handler.on('request', () => {});
      handler.on('request', () => {});
      expect(eventEmitter.hasListeners('request')).to.be.true;
      expect(eventEmitter.listeners('request')).to.have.lengthOf(3);

      handler.off('request', fn);
      expect(eventEmitter.hasListeners('request')).to.be.true;
      expect(eventEmitter.listeners('request')).to.have.lengthOf(2);
      expect(eventEmitter.listeners('request').includes(fn)).to.be.false;

      handler.off('request');
      expect(eventEmitter.hasListeners('request')).to.be.false;
      expect(eventEmitter.listeners('request')).to.have.lengthOf(0);
    });
  });

  describe('.intercept()', function () {
    it('registers an intercept handler', function () {
      const handler = new Handler();

      handler.intercept(() => {});
      expect(handler.has('intercept')).to.be.true;
    });

    it('throws when passing a non-function to intercept', function () {
      const handler = new Handler();

      [null, undefined, {}, [], ''].forEach((value) => {
        expect(() => handler.intercept(value)).to.throw(
          /Invalid intercept handler provided/
        );
      });
    });

    it('throws when passing an invalid times option', function () {
      const handler = new Handler();

      ['1', -1, 0].forEach((times) => {
        expect(() => handler.intercept(() => {}, { times })).to.throw(
          /Invalid number provided/
        );
      });
    });

    it('registers an intercept handler with { times }', function () {
      const handler = new Handler();

      handler.intercept(() => {}, { times: 2 });
      expect(handler.has('intercept')).to.be.true;

      handler.get('intercept')();
      expect(handler.has('intercept')).to.be.true;

      handler.get('intercept')();
      expect(handler.has('intercept')).to.be.false;
    });

    it('registers an intercept handler with .times()', function () {
      const handler = new Handler();

      handler.times(2).intercept(() => {});
      expect(handler.has('intercept')).to.be.true;

      handler.get('intercept')();
      expect(handler.has('intercept')).to.be.true;

      handler.get('intercept')();
      expect(handler.has('intercept')).to.be.false;
    });

    it('registers an intercept handler with .times() and override with { times }', function () {
      const handler = new Handler();

      handler.times(2).intercept(() => {}, { times: 1 });
      expect(handler.has('intercept')).to.be.true;

      handler.get('intercept')();
      expect(handler.has('intercept')).to.be.false;
    });
  });

  describe('.passthrough()', function () {
    it('should work', function () {
      const handler = new Handler();

      expect(handler.has('passthrough')).to.be.false;

      handler.passthrough();
      expect(handler.get('passthrough')).to.be.true;

      handler.passthrough(false);
      expect(handler.get('passthrough')).to.be.false;
    });

    it('removes the intercept handler on passthrough', function () {
      const handler = new Handler();

      handler.intercept(() => {});
      expect(handler.has('intercept')).to.be.true;

      handler.passthrough();
      expect(handler.get('passthrough')).to.be.true;
      expect(handler.has('intercept')).to.be.false;
    });

    it('disables passthrough on intercept', function () {
      const handler = new Handler();

      handler.passthrough();
      expect(handler.get('passthrough')).to.be.true;
      expect(handler.has('intercept')).to.be.false;

      handler.intercept(() => {});
      expect(handler.has('intercept')).to.be.true;
      expect(handler.get('passthrough')).to.be.false;
    });
  });

  describe('.recordingName()', function () {
    it('should work', function () {
      const handler = new Handler();

      expect(handler.has('recordingName')).to.be.false;

      handler.recordingName('Test');
      expect(handler.get('recordingName')).to.equal('Test');

      handler.recordingName();
      expect(handler.has('recordingName')).to.be.true;
      expect(handler.get('recordingName')).to.be.undefined;
    });

    it('should allow setting a falsy recordingName', function () {
      const handler = new Handler();

      expect(handler.has('recordingName')).to.be.false;

      [false, undefined, null].forEach((value) => {
        handler.recordingName(value);
        expect(handler.has('recordingName')).to.be.true;
        expect(handler.get('recordingName')).to.equal(value);
      });
    });

    it('throws when passing an invalid truthy recording name', function () {
      const handler = new Handler();

      [1, {}, [], true].forEach((value) => {
        expect(() => handler.recordingName(value)).to.throw(
          /Invalid recording name provided/
        );
      });
    });
  });

  describe('.configure()', function () {
    it('should work', function () {
      const handler = new Handler();

      expect(handler.get('config')).to.deep.equal({});

      handler.configure({ logging: true });
      expect(handler.get('config')).to.deep.equal({ logging: true });

      handler.configure({ recordIfMissing: false });
      expect(handler.get('config')).to.deep.equal({ recordIfMissing: false });

      handler.configure({});
      expect(handler.get('config')).to.deep.equal({});
    });

    it('throws when passing an invalid config', function () {
      const handler = new Handler();

      [false, true, null, undefined, 1, []].forEach((config) => {
        expect(() => handler.configure(config)).to.throw(
          /Invalid config provided/
        );
      });

      [
        'mode',
        'adapters',
        'adapterOptions',
        'persister',
        'persisterOptions'
      ].forEach((key) => {
        expect(() => handler.configure({ [key]: key })).to.throw(
          /Invalid configuration option provided/
        );
      });
    });
  });

  describe('.filter()', function () {
    it('should work', function () {
      const handler = new Handler();
      const filters = handler.get('filters');
      const fn = () => {};

      expect(filters.size).to.equal(0);

      handler.filter(fn);
      expect(filters.size).to.equal(1);

      handler.filter(fn);
      expect(filters.size).to.equal(1);

      handler.filter(() => {});
      expect(filters.size).to.equal(2);
    });

    it('throws when passing an invalid fn', function () {
      const handler = new Handler();

      [false, true, null, undefined, 1, [], {}, ''].forEach((fn) => {
        expect(() => handler.filter(fn)).to.throw(
          /Invalid filter callback provided/
        );
      });
    });
  });

  describe('.times()', function () {
    it('should work', function () {
      const handler = new Handler();
      const defaultOptions = handler.get('defaultOptions');

      expect(defaultOptions).to.deep.equal({});

      handler.times(1);
      expect(defaultOptions).to.deep.equal({ times: 1 });

      handler.times(2);
      expect(defaultOptions).to.deep.equal({ times: 2 });

      handler.times();
      expect(defaultOptions).to.deep.equal({});
    });

    it('throws when passing an invalid times option', function () {
      const handler = new Handler();

      ['1', -1, 0].forEach((times) => {
        expect(() => handler.times(times)).to.throw(/Invalid number provided/);
      });
    });
  });
});
