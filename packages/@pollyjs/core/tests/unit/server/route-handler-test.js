import RouteHandler from '../../../src/server/route-handler';

describe('Unit | Server | RouteHandler', function() {
  it('should exist', function() {
    expect(RouteHandler).to.be.a('function');
  });

  it('should default passthrough to false', function() {
    expect(new RouteHandler().get('passthrough')).to.be.false;
  });

  it('should respect default passthrough', function() {
    expect(new RouteHandler([['passthrough', true]]).get('passthrough')).to.be
      .true;
  });

  it('registers an intercept handler', function() {
    const handler = new RouteHandler();

    handler.intercept(() => {});
    expect(handler.has('intercept')).to.be.true;
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
    expect(handler.has('intercept')).to.be.true;

    handler.passthrough();
    expect(handler.get('passthrough')).to.be.true;
    expect(handler.has('intercept')).to.be.false;
  });

  it('disables passthrough on intercept', function() {
    const handler = new RouteHandler();

    handler.passthrough();
    expect(handler.get('passthrough')).to.be.true;
    expect(handler.has('intercept')).to.be.false;

    handler.intercept(() => {});
    expect(handler.has('intercept')).to.be.true;
    expect(handler.get('passthrough')).to.be.false;
  });
});
