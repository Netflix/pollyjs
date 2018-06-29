import Persister from '../../src';

describe('Unit | Persister', function() {
  it('should exist', function() {
    expect(Persister).to.be.a('function');
  });

  describe('Caching', function() {
    let callCounts, recording;

    beforeEach(function() {
      callCounts = { find: 0, save: 0, delete: 0 };
      recording = {
        log: {
          creator: {
            name: 'Polly.JS'
          }
        }
      };

      class CustomPersister extends Persister {
        findRecording() {
          callCounts.find++;

          return recording;
        }

        saveRecording() {
          callCounts.save++;
        }

        deleteRecording() {
          callCounts.delete++;
        }
      }

      this.persister = new CustomPersister({});
    });

    it('caches', async function() {
      await this.persister.find('test');
      await this.persister.find('test');
      await this.persister.find('test');

      expect(callCounts.find).to.equal(1);
    });

    it('does not cache falsy values', async function() {
      recording = null;

      await this.persister.find('test');
      await this.persister.find('test');
      await this.persister.find('test');

      expect(callCounts.find).to.equal(3);
    });

    it('busts the cache after a save', async function() {
      await this.persister.find('test');
      await this.persister.save('test');
      await this.persister.find('test');
      await this.persister.find('test');

      expect(callCounts.save).to.equal(1);
      expect(callCounts.find).to.equal(2);
    });

    it('busts the cache after a delete', async function() {
      await this.persister.find('test');
      await this.persister.delete('test');
      await this.persister.find('test');
      await this.persister.find('test');

      expect(callCounts.delete).to.equal(1);
      expect(callCounts.find).to.equal(2);
    });
  });
});
