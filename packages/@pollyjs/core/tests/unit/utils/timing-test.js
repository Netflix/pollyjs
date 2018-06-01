import Timing from '../../../src/utils/timing';

function fixedTest(ms) {
  it(`should handle ${ms}ms`, async function() {
    // Fail the test if it exceeds ms + 10ms buffer
    this.timeout(ms + 10);

    const promise = Timing.fixed(ms)();
    let resolved = false;

    promise.then(() => (resolved = true));

    if (ms) {
      setTimeout(() => expect(resolved).to.be.false, ms / 2);
    }
    setTimeout(() => expect(resolved).to.be.true, ms);

    await promise;
  });
}

function relativeTest(ratio) {
  const timeout = ratio * 100;

  it(`should handle a ratio of ${ratio}`, async function() {
    // Fail the test if it exceeds timeout + 10ms buffer
    this.timeout(timeout + 10);

    const now = new Date().getTime();
    const promise = Timing.relative(ratio)(now, now + 100);
    let resolved = false;

    promise.then(() => (resolved = true));

    if (timeout) {
      setTimeout(() => expect(resolved).to.be.false, timeout / 2);
    }
    setTimeout(() => expect(resolved).to.be.true, timeout);

    await promise;
  });
}

describe('Unit | Utils | Timing', function() {
  it('should exist', function() {
    expect(Timing).to.be.a('object');
    expect(Timing.fixed).to.be.a('function');
    expect(Timing.relative).to.be.a('function');
  });

  describe('fixed', function() {
    fixedTest(0);
    fixedTest(50);
    fixedTest(100);
  });

  describe('relative', function() {
    relativeTest(0);
    relativeTest(0.5);
    relativeTest(1.0);
    relativeTest(2.0);
  });
});
