import * as PollyExports from '../../src';

describe('Unit | Index', function() {
  it('should export all the necessary modules', function() {
    [
      'Polly',
      'Timing',
      'XHRAdapter',
      'FetchAdapter',
      'setupQunit',
      'setupMocha'
    ].forEach(name => {
      expect(PollyExports[name]).to.be.ok;
    });
  });
});
