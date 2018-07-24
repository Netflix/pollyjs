import DeferredPromise from '../../../src/utils/deferred-promise';

describe('Unit | Utils | DeferredPromise', function() {
  it('should exist', function() {
    expect(DeferredPromise).to.be.a('function');
    expect(new DeferredPromise().resolve).to.be.a('function');
    expect(new DeferredPromise().reject).to.be.a('function');
  });

  it('should resolve when calling .resolve()', async function() {
    const promise = new DeferredPromise();

    promise.resolve(42);
    expect(await promise).to.equal(42);
  });

  it('should reject when calling .reject()', async function() {
    const promise = new DeferredPromise();

    promise.reject(new Error('42'));

    try {
      await promise;
    } catch (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('42');
    }
  });
});
