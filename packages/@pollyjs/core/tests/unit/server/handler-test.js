import Handler from '../../../src/server/handler';

describe('Unit | Server | Handler', function() {
  it('should exist', function() {
    expect(Handler).to.be.a('function');
  });

  it('throws on registering an unknown event name', function() {
    expect(() => new Handler().on('unknownEventName')).to.throw(
      /Invalid event name provided/
    );
  });

  it('throws on un-registering an unknown event name', function() {
    expect(() => new Handler().off('unknownEventName')).to.throw(
      /Invalid event name provided/
    );
  });

  it('registers a known event via .on()', function() {
    const handler = new Handler();
    const { _eventEmitter: eventEmitter } = handler;

    expect(eventEmitter.hasListeners('request')).to.be.false;

    handler.on('request', () => {});
    expect(eventEmitter.hasListeners('request')).to.be.true;

    handler.on('request', () => {});
    expect(eventEmitter.listeners('request')).to.have.lengthOf(2);
  });

  it('un-registers a known event via .off()', function() {
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
