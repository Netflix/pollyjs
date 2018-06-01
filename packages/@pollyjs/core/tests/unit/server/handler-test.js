import Handler from '../../../src/server/handler';

describe('Unit | Server | Handler', function() {
  it('should exist', function() {
    expect(Handler).to.be.a('function');
  });

  it('throws on registering an unknown event name', function() {
    expect(() => new Handler().on('unknownEventName')).to.throw(
      `[Polly] Invalid event name provided: "unknownEventName". Possible events: beforeRequest, beforeReplay, beforeRecord, beforeResponse, afterResponse.`
    );
  });

  it('throws on un-registering an unknown event name', function() {
    expect(() => new Handler().off('unknownEventName')).to.throw(
      `[Polly] Invalid event name provided: "unknownEventName". Possible events: beforeRequest, beforeReplay, beforeRecord, beforeResponse, afterResponse.`
    );
  });

  it('registers a known event via .on()', function() {
    const handler = new Handler();

    expect(handler.hasEvent('beforeRequest')).to.be.false;

    handler.on('beforeRequest', () => {});
    expect(handler.hasEvent('beforeRequest')).to.be.true;

    handler.on('beforeRequest', () => {});
    expect(handler.get('beforeRequest').length).to.equal(2);
  });

  it('un-registers a known event via .off()', function() {
    const handler = new Handler();
    const fn = () => {};

    handler.on('beforeRequest', fn);
    handler.on('beforeRequest', () => {});
    handler.on('beforeRequest', () => {});
    expect(handler.hasEvent('beforeRequest')).to.be.true;
    expect(handler.get('beforeRequest').length).to.equal(3);

    handler.off('beforeRequest', fn);
    expect(handler.hasEvent('beforeRequest')).to.be.true;
    expect(handler.get('beforeRequest').length).to.equal(2);
    expect(handler.get('beforeRequest').includes(fn)).to.be.false;

    handler.off('beforeRequest');
    expect(handler.hasEvent('beforeRequest')).to.be.false;
    expect(handler.has('beforeRequest')).to.be.false;
  });
});
