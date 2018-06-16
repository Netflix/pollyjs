import * as PollyExports from '../../src';

describe('Unit | Index', function() {
  it('should export all the necessary modules', function() {
    [
      'Polly',
      'Timing',
      'setupQunit',
      'setupMocha',
      'XHRAdapter',
      'FetchAdapter',
      'RESTPersister',
      'LocalStoragePersister'
    ].forEach(name => {
      expect(PollyExports[name]).to.be.ok;
    });
  });
});
