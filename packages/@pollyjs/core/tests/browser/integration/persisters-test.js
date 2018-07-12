import { setupMocha as setupPolly, Polly } from '../../../src';
import * as setupFetch from '../helpers/setup-fetch';
import Configs from './configs';
import * as validate from 'har-validator/lib/async';

const { keys } = Object;

describe('Integration | Persisters', function() {
  for (const name in Configs) {
    const defaults = Configs[name];

    describe(name, function() {
      setupPolly.beforeEach(defaults);
      setupFetch.beforeEach();

      afterEach(async function() {
        await this.polly.persister.delete(this.polly.recordingId);
      });

      setupFetch.afterEach();
      setupPolly.afterEach();

      it('should persist valid HAR', async function() {
        const { recordingId, persister } = this.polly;

        this.polly.record();
        await this.fetch('/api/db/foo?order=1');
        await persister.persist();

        expect(
          await validate.har(await persister.find(recordingId))
        ).to.be.true;

        await this.fetch('/api/db/foo?foo=bar&bar=baz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foo: 'bar', bar: 'baz' })
        });
        await persister.persist();

        expect(
          await validate.har(await persister.find(recordingId))
        ).to.be.true;
      });

      it('should add new entries to an existing recording', async function() {
        const { recordingId, recordingName } = this.polly;
        let { persister } = this.polly;

        this.polly.record();
        await this.fetch('/api/db/foo?order=1');
        await persister.persist();

        let har = await persister.find(recordingId);

        expect(har.log.entries).to.have.lengthOf(1);

        await this.polly.stop();

        this.polly = new Polly(recordingName, defaults);
        persister = this.polly.persister;

        this.polly.record();
        await this.fetch('/api/db/foo?order=1');
        await this.fetch('/api/db/foo?order=1');
        await this.fetch('/api/db/foo?order=2');
        await persister.persist();

        har = await persister.find(recordingId);

        expect(har.log.entries).to.have.lengthOf(3);
        expect(
          har.log.entries.filter(e =>
            e.request.url.includes('/api/db/foo?order=1')
          )
        ).to.have.lengthOf(2);
        expect(
          har.log.entries.filter(e =>
            e.request.url.includes('/api/db/foo?order=2')
          )
        ).to.have.lengthOf(1);
      });

      it('should emit beforePersist', async function() {
        const { persister, server } = this.polly;
        let beforePersistCalled = false;

        server.get('/api/db/:id').on('beforePersist', (req /*, res*/) => {
          expect(req.params.id).to.equal('foo');
          expect(beforePersistCalled).to.be.false;
          expect(() => (req.body = 'test')).to.throw(Error);
          beforePersistCalled = true;
        });

        this.polly.record();

        await this.fetch('/api/db/foo');
        expect(beforePersistCalled).to.be.false;

        await persister.persist();
        expect(beforePersistCalled).to.be.true;
      });

      it('should error when persisting a failed request', async function() {
        let error;

        this.polly.configure({ recordFailedRequests: false });

        try {
          await this.fetch('/should-not-exist');
          await this.polly.stop();
        } catch (e) {
          error = e;
        } finally {
          const savedRecording = await this.polly.persister.find(
            this.polly.recordingId
          );

          expect(savedRecording).to.be.null;
          expect(error.message).to.contain('Cannot persist response for');

          // Clear the pending requests so `this.polly.stop()` in the
          // afterEach hook won't bomb.
          this.polly.persister.pending.clear();
        }
      });

      it('should not error when persisting a failed request and `recordFailedRequests` is true', async function() {
        this.polly.configure({ recordFailedRequests: true });

        await this.fetch('/should-not-exist-either');
        await this.fetch('/should-not-exist-also');
        await this.polly.stop();

        const har = await this.polly.persister.find(this.polly.recordingId);

        expect(har).to.be.a('object');
        expect(keys(har.log.entries)).to.have.lengthOf(2);
      });
    });
  }
});
