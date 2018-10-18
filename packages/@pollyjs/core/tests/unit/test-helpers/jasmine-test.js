import setupPolly from '../../../src/test-helpers/jasmine';

class JasmineMock {
  constructor() {
    this.topSuite = {
      id: 'suite0',
      description: 'root suite with unreadable description',
      parentSuite: null,
      children: [
        {
          id: 'suite1',
          description: 'suite1',
          parentSuite: null,
          children: [
            {
              id: 'special_test_id_to_test_name_generation',
              description: 'test case',
              parentSuite: null
            }
          ]
        }
      ]
    };

    this.topSuite.children[0].parentSuite = this.topSuite;
    this.topSuite.children[0].children[0].parentSuite = this.topSuite.children[0];

    this.it = name => ({
      id: name,
      description: name,
      beforeAndAfterFns: () => ({ befores: [], afters: [] })
    });

    this.env = { it: this.it, fit: this.it, topSuite: () => this.topSuite };

    this.getEnv = () => this.env;
  }
}

class ContextMock {
  constructor() {
    this.before = new Set();
    this.after = new Set();

    this.jasmine = new JasmineMock();
  }

  beforeAll(fn) {
    this.before.add(fn);
  }

  __callBefore() {
    this.before.forEach(fn => fn());
  }

  afterAll(fn) {
    this.after.add(fn);
  }

  __callAfter() {
    this.after.forEach(fn => fn());
  }
}

describe('Unit | Test Helpers | jasmine', () => {
  it('should throw if jasmine is not found in context', () => {
    expect(() => setupPolly({}, null)).to.throw();
  });

  it('should attach polly to jasmine environment', () => {
    const stub = new ContextMock();
    const env = stub.jasmine.getEnv();

    expect(env[setupPolly.IS_POLLY_ATTACHED]).to.be.undefined;

    setupPolly({}, stub);

    expect(env[setupPolly.IS_POLLY_ATTACHED]).to.equal(true);
  });

  it('should add beforeAll and afterAll hooks', () => {
    const stub = new ContextMock();

    setupPolly({}, stub);

    expect(stub.before.size).to.equal(1);
    expect(stub.after.size).to.equal(1);
  });

  it('should proxy jasmine `it` and `fit` env methods', () => {
    const stub = new ContextMock();

    setupPolly({}, stub);

    expect(stub.jasmine.getEnv().it).not.to.equal(stub.jasmine.it);

    const spec = stub.jasmine.getEnv().it('test case name');

    expect(spec).to.have.property('id', 'test case name');
    expect(spec).to.have.property('description', 'test case name');
    expect(spec).to.have.property('beforeAndAfterFns');
  });

  it('should activate polly when beforeAll hook is called', () => {
    const stub = new ContextMock();
    const env = stub.jasmine.getEnv();

    setupPolly({}, stub);

    expect(env[setupPolly.IS_POLLY_ACTIVE]).to.equal(false);

    stub.__callBefore();

    expect(env[setupPolly.IS_POLLY_ACTIVE]).to.equal(true);
  });

  it('should deactivate polly when afterAll hook is called', () => {
    const stub = new ContextMock();
    const env = stub.jasmine.getEnv();

    setupPolly({}, stub);

    stub.__callBefore();

    expect(env[setupPolly.IS_POLLY_ACTIVE]).to.equal(true);

    stub.__callAfter();

    expect(env[setupPolly.IS_POLLY_ACTIVE]).to.equal(false);
  });

  it('should create new polly instance if polly is active', async () => {
    const stub = new ContextMock();

    const context = setupPolly({}, stub);

    stub.__callBefore();

    const spec = stub.jasmine.getEnv().it('test case name');

    const { befores } = spec.beforeAndAfterFns();

    await befores[0].fn();

    expect(context.polly).to.be.ok;
    expect(context.polly.recordingName).to.equal('test case name');
  });

  it('should create nested name for the test', async () => {
    const stub = new ContextMock();

    const context = setupPolly({}, stub);

    stub.__callBefore();

    const spec = stub.jasmine
      .getEnv()
      .it('special_test_id_to_test_name_generation');

    const { befores } = spec.beforeAndAfterFns();

    await befores[0].fn();

    expect(context.polly.recordingName).to.equal(
      'suite1/special_test_id_to_test_name_generation'
    );
  });
});
