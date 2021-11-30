import { timeout } from '@pollyjs/utils';

import Persister from '../../src';

describe('Unit | Persister', function () {
  it('should exist', function () {
    expect(Persister).to.be.a('function');
  });

  describe('Caching', function () {
    let callCounts, recording;

    beforeEach(function () {
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

        async onFindRecording() {
          callCounts.find++;
          await timeout(1);

          return recording;
        }

        async onSaveRecording() {
          callCounts.save++;
          await timeout(1);
        }

        async onDeleteRecording() {
          callCounts.delete++;
          await timeout(1);
        }
      }

      this.persister = new CustomPersister({
        logger: {
          log: { debug: () => {} }
        }
      });
    });

    it('should handle concurrent find requests', async function () {
      await Promise.all([
        this.persister.findRecording('test'),
        this.persister.findRecording('test'),
        this.persister.findRecording('test')
      ]);

      expect(callCounts.find).to.equal(1);
    });

    it('caches', async function () {
      await this.persister.findRecording('test');
      await this.persister.findRecording('test');
      await this.persister.findRecording('test');

      expect(callCounts.find).to.equal(1);
    });

    it('does not cache falsy values', async function () {
      recording = null;

      await this.persister.findRecording('test');
      await Promise.all([
        this.persister.findRecording('test'),
        this.persister.findRecording('test'),
        this.persister.findRecording('test')
      ]);
      await this.persister.findRecording('test');

      expect(callCounts.find).to.equal(3);
    });

    it('busts the cache after a save', async function () {
      await this.persister.findRecording('test');
      await this.persister.saveRecording('test');
      await this.persister.findRecording('test');
      await this.persister.findRecording('test');

      expect(callCounts.save).to.equal(1);
      expect(callCounts.find).to.equal(2);
    });

    it('busts the cache after a delete', async function () {
      await this.persister.findRecording('test');
      await this.persister.deleteRecording('test');
      await this.persister.findRecording('test');
      await this.persister.findRecording('test');

      expect(callCounts.delete).to.equal(1);
      expect(callCounts.find).to.equal(2);
    });
  });
});
