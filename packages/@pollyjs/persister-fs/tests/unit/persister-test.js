import rimraf from 'rimraf';
import fixturify from 'fixturify';

import FSPersister from '../../src';

class MockPolly {
  constructor(persisterOptions = {}) {
    this.config = {
      persisterOptions: { fs: persisterOptions || {} }
    };
  }
}

describe('Unit | FS Persister', function() {
  afterEach(function() {
    rimraf.sync('recordings');
  });

  it('should exist', function() {
    expect(FSPersister).to.be.a('function');
  });

  it('should have a id', function() {
    expect(FSPersister.id).to.equal('fs');
  });

  describe('Options', function() {
    it('recordingsDir', function() {
      let persister = new FSPersister(new MockPolly());

      expect(persister.options.recordingsDir)
        .to.equal(persister.defaultOptions.recordingsDir)
        .and.to.equal('recordings');

      persister = new FSPersister(
        new MockPolly({
          recordingsDir: 'recordings/tmp'
        })
      );

      expect(persister.options.recordingsDir)
        .to.equal('recordings/tmp')
        .and.to.not.equal(persister.defaultOptions.recordingsDir);

      fixturify.writeSync('recordings/tmp', {
        'FS-Persister': {
          'recording.har': '{}'
        }
      });

      expect(persister.findRecording('FS-Persister')).to.deep.equal({});
    });
  });

  describe('API', function() {
    beforeEach(function() {
      this.persister = new FSPersister(new MockPolly());

      fixturify.writeSync('recordings', {
        'FS-Persister': {
          'recording.har': '{}'
        }
      });
    });

    it('saveRecording', function() {
      expect(this.persister.findRecording('FS-Persister')).to.deep.equal({});

      this.persister.saveRecording('FS-Persister', { foo: 'bar' });
      expect(this.persister.findRecording('FS-Persister')).to.deep.equal({
        foo: 'bar'
      });
    });

    it('findRecording', function() {
      expect(this.persister.findRecording('FS-Persister')).to.deep.equal({});
      expect(this.persister.findRecording('Does-Not-Exist')).to.be.null;
    });

    it('deleteRecording', function() {
      expect(this.persister.findRecording('FS-Persister')).to.not.be.null;

      this.persister.deleteRecording('FS-Persister');
      expect(this.persister.findRecording('Does-Not-Exist')).to.be.null;
    });
  });
});
