import Interceptor from '../../../src/-private/interceptor';

describe('Unit | Interceptor', function() {
  it('should exist', function() {
    expect(Interceptor).to.be.a('function');
  });

  it('should have the correct defaults', function() {
    const interceptor = new Interceptor();

    expect(interceptor.type).to.equal('intercept');
    expect(interceptor.shouldAbort).to.be.false;
    expect(interceptor.shouldPassthrough).to.be.false;
    expect(interceptor.shouldIntercept).to.be.true;
    expect(interceptor.shouldStopPropagating).to.be.false;
  });

  it('should disable passthrough when calling abort and vise versa', function() {
    const interceptor = new Interceptor();

    expect(interceptor.shouldAbort).to.be.false;
    expect(interceptor.shouldPassthrough).to.be.false;

    interceptor.abort();
    expect(interceptor.shouldAbort).to.be.true;
    expect(interceptor.shouldPassthrough).to.be.false;

    interceptor.passthrough();
    expect(interceptor.shouldAbort).to.be.false;
    expect(interceptor.shouldPassthrough).to.be.true;
  });

  it('.abort()', function() {
    const interceptor = new Interceptor();

    expect(interceptor.shouldAbort).to.be.false;
    expect(interceptor.shouldIntercept).to.be.true;

    interceptor.abort();

    expect(interceptor.shouldAbort).to.be.true;
    expect(interceptor.shouldIntercept).to.be.false;
  });

  it('.passthrough()', function() {
    const interceptor = new Interceptor();

    expect(interceptor.shouldPassthrough).to.be.false;
    expect(interceptor.shouldIntercept).to.be.true;

    interceptor.passthrough();

    expect(interceptor.shouldPassthrough).to.be.true;
    expect(interceptor.shouldIntercept).to.be.false;
  });

  it('.stopPropagation()', function() {
    const interceptor = new Interceptor();

    expect(interceptor.shouldStopPropagating).to.be.false;
    interceptor.stopPropagation();
    expect(interceptor.shouldStopPropagating).to.be.true;
  });
});
