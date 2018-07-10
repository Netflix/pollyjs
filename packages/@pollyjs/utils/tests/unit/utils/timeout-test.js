import timeout from '../../../src/utils/timeout';

describe('Unit | Utils | timeout', function() {
  it('should exist', function() {
    expect(timeout).to.be.a('function');
  });

  it('should return a promise', async function() {
    const promise = timeout(10);

    expect(promise).to.be.a('promise');

    await promise;
  });

  it('should timeout for the correct amount of ms', async function() {
    this.timeout(110);

    const promise = timeout(100);
    let resolved = false;

    promise.then(() => (resolved = true));

    setTimeout(() => expect(resolved).to.be.false, 50);
    setTimeout(() => expect(resolved).to.be.true, 101);

    await promise;
  });
});
