import mergeConfigs from '../../../src/utils/merge-configs';

describe('Unit | Utils | mergeConfigs', function () {
  it('should exist', function () {
    expect(mergeConfigs).to.be.a('function');
  });

  it('should not deep merge context objects', async function () {
    const context = {};
    const config = mergeConfigs(
      { fetch: {}, xhr: {} },
      { fetch: { context } },
      { xhr: { context } },
      { fetch: {}, xhr: {} }
    );

    expect(config.fetch.context).to.equal(context);
    expect(config.xhr.context).to.equal(context);
  });

  it('should not deep merge arrays', async function () {
    const array = [{}];
    const config = mergeConfigs({ array: [] }, { array });

    expect(config.array).to.equal(array);
    expect(config.array[0]).to.equal(array[0]);
  });
});
