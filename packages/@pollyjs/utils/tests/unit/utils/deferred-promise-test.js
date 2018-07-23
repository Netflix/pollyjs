import DeferredPromise from '../../../src/utils/deferred-promise';

describe('Unit | Utils | DeferredPromise', function() {
  it('should exist', function() {
    expect(DeferredPromise).to.be.a('function');
    expect(DeferredPromise().resolve).to.be.a('function');
    expect(DeferredPromise().reject).to.be.a('function');
  });

  it('should resolve when calling .resolve()', async function() {
    const promise = DeferredPromise();

    promise.resolve(42);
    expect(await promise).to.equal(42);
  });

  it('should reject when calling .reject()', async function() {
    const promise = DeferredPromise();

    promise.reject(new Error('42'));
    expect(async () => await promise).to.throw(Error, /42/);
  });
});
