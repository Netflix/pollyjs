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

    expect(handler._hasEventHandlers('request')).to.be.false;

    handler.on('request', () => {});
    expect(handler._hasEventHandlers('request')).to.be.true;

    handler.on('request', () => {});
    expect(handler._getEventHandlers('request').length).to.equal(2);
  });

  it('un-registers a known event via .off()', function() {
    const handler = new Handler();
    const fn = () => {};

    handler.on('request', fn);
    handler.on('request', () => {});
    handler.on('request', () => {});
    expect(handler._hasEventHandlers('request')).to.be.true;
    expect(handler._getEventHandlers('request').length).to.equal(3);

    handler.off('request', fn);
    expect(handler._hasEventHandlers('request')).to.be.true;
    expect(handler._getEventHandlers('request').length).to.equal(2);
    expect(handler._getEventHandlers('request').includes(fn)).to.be.false;

    handler.off('request');
    expect(handler._hasEventHandlers('request')).to.be.false;
    expect(handler._getEventHandlers('request').length).to.equal(0);
  });
});
