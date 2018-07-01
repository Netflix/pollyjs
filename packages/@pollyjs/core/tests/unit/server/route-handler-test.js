import RouteHandler from '../../../src/server/route-handler';

describe('Unit | Server | RouteHandler', function() {
  it('should exist', function() {
    expect(RouteHandler).to.be.a('function');
  });

  it('should default passthrough to false', function() {
    expect(new RouteHandler()._passthrough).to.be.false;
  });

  it('registers an intercept handler', function() {
    const handler = new RouteHandler();

    handler.intercept(() => {});
    expect(handler._intercept).to.be.a('function');
  });

  it('throws when passing a non-function to intercept', function() {
    const handler = new RouteHandler();

    [null, undefined, {}, [], ''].forEach(value => {
      expect(() => handler.intercept(value)).to.throw(
        /Invalid intercept handler provided/
      );
    });
  });

  it('removes the intercept handler on passthrough', function() {
    const handler = new RouteHandler();

    handler.intercept(() => {});
    expect(handler._intercept).to.be.a('function');

    handler.passthrough();
    expect(handler._passthrough).to.be.true;
    expect(handler._intercept).to.not.be.a('function');
  });

  it('disables passthrough on intercept', function() {
    const handler = new RouteHandler();

    handler.passthrough();
    expect(handler._passthrough).to.be.true;
    expect(handler._intercept).to.not.be.a('function');

    handler.intercept(() => {});
    expect(handler._passthrough).to.be.false;
    expect(handler._intercept).to.be.a('function');
  });
});
