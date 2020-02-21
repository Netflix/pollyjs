import { timeout } from '@pollyjs/utils';

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
        static get id() {
          return 'CustomPersister';
        }

        async findRecording() {
          callCounts.find++;
          await timeout(1);

          return recording;
        }

        async saveRecording() {
          callCounts.save++;
          await timeout(1);
        }

        async deleteRecording() {
          callCounts.delete++;
          await timeout(1);
        }
      }

      this.persister = new CustomPersister({});
    });

    it('should handle concurrent find requests', async function() {
      await Promise.all([
        this.persister.find('test'),
        this.persister.find('test'),
        this.persister.find('test')
      ]);

      expect(callCounts.find).to.equal(1);
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
      await Promise.all([
        this.persister.find('test'),
        this.persister.find('test'),
        this.persister.find('test')
      ]);
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
