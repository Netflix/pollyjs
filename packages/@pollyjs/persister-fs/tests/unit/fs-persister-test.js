import FSPersister from '../../src';
import mock from 'mock-fs';

class MockPolly {
  constructor(persisterOptions = {}) {
    this.config = {
      persisterOptions: { fs: persisterOptions || {} }
    };
  }
}

describe('Unit | FS Persister', function() {
  it('should exist', function() {
    expect(FSPersister).to.be.a('function');
  });

  it('should have a name', function() {
    expect(FSPersister.name).to.equal('fs');
  });

  describe('Options', function() {
    it('recordingsDir', function() {
      let persister = new FSPersister(new MockPolly());

      expect(persister.options.recordingsDir)
        .to.equal(persister.defaultOptions.recordingsDir)
        .and.to.equal('recordings');

      persister = new FSPersister(
        new MockPolly({
          recordingsDir: '__recordings__'
        })
      );

      expect(persister.options.recordingsDir)
        .to.equal('__recordings__')
        .and.to.not.equal(persister.defaultOptions.recordingsDir);

      mock({
        '__recordings__/FS-Persister/recording.har': '{}'
      });

      expect(persister.findRecording('FS-Persister')).to.deep.equal({});

      mock.restore();
    });
  });

  describe('API', function() {
    beforeEach(function() {
      this.persister = new FSPersister(new MockPolly());

      mock({
        'recordings/FS-Persister/recording.har': '{}'
      });
    });

    afterEach(() => mock.restore());

    it('findRecording', function() {
      expect(this.persister.findRecording('FS-Persister')).to.deep.equal({});
      expect(this.persister.findRecording('Does-Not-Exist')).to.be.null;
    });

    it('saveRecording', function() {
      expect(this.persister.findRecording('FS-Persister')).to.deep.equal({});

      this.persister.saveRecording('FS-Persister', { foo: 'bar' });
      expect(this.persister.findRecording('FS-Persister')).to.deep.equal({
        foo: 'bar'
      });
    });

    it('deleteRecording', function() {
      expect(this.persister.findRecording('FS-Persister')).to.not.be.null;

      this.persister.deleteRecording('FS-Persister');
      expect(this.persister.findRecording('Does-Not-Exist')).to.be.null;
    });
  });
});
