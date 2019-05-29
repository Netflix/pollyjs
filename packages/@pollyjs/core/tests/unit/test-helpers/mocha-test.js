import setupPolly from '../../../src/test-helpers/mocha';

class Sandbox {
  constructor(context) {
    this.beforeEachCalled = new Set();
    this.afterEachCalled = new Set();
    this.context = context || { currentTest: { title: 'mockname' } };
  }

  beforeEach(fn) {
    this.beforeEachCalled.add(fn);
    fn.call(this.context, undefined);
  }

  afterEach(fn) {
    this.afterEachCalled.add(fn);
    fn.call(this.context, undefined);
  }
}

describe('Unit | Test Helpers | mocha', function() {
  it('should exist', function() {
    expect(setupPolly).to.be.a('function');
    expect(setupPolly.beforeEach).to.be.a('function');
    expect(setupPolly.afterEach).to.be.a('function');
  });

  it('should invoke beforeEach and afterEach', function() {
    const stub = new Sandbox();

    setupPolly({}, stub);
    expect(stub.beforeEachCalled.size).to.equal(1);
    expect(stub.afterEachCalled.size).to.equal(1);
  });

  it('should create a polly property and set recordingName', function() {
    const stub = new Sandbox();

    setupPolly({}, stub);
    expect(stub.context.polly).to.be.a('object');
    expect(stub.context.polly.recordingName).to.equal('mockname');
  });

  it('should concat title if test is deeply nested', function() {
    const stub = new Sandbox({
      currentTest: {
        title: 'foo',
        parent: {
          title: 'bar',
          parent: {
            title: 'baz'
          }
        }
      }
    });

    setupPolly({}, stub);
    expect(stub.context.polly.recordingName).to.equal('baz/bar/foo');
  });
});
