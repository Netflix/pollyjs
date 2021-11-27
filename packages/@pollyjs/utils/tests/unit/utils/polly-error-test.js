import PollyError from '../../../src/utils/polly-error';

describe('Unit | Utils | PollyError', function () {
  it('should exist', function () {
    expect(PollyError).to.be.a('function');
  });

  it('should set the name to PollyError', function () {
    const error = new PollyError('Test');

    expect(error.name).to.equal('PollyError');
  });

  it('should prefix the message with [Polly]', function () {
    const error = new PollyError('Test');

    expect(error.message).to.equal('[Polly] Test');
  });
});
