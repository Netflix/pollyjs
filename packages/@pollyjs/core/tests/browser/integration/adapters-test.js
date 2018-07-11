import 'formdata-polyfill';

import { setupMocha as setupPolly } from '../../../src';
import * as setupFetch from '../helpers/setup-fetch';
import File from '../helpers/file';
import Configs from './configs';
import { ACTIONS } from '@pollyjs/utils';

describe('Integration | Adapters', function() {
  for (const name in Configs) {
    const defaults = Configs[name];

    describe(name, function() {
      setupPolly.beforeEach(defaults);
      setupFetch.beforeEach(defaults.adapters[0]);
      setupFetch.afterEach();
      setupPolly.afterEach();

      it('should respect request order', async function() {
        let res = await this.fetchRecord();

        expect(res.status).to.equal(404);

        res = await this.fetchRecord({
          method: 'POST',
          body: JSON.stringify({ foo: 'bar' }),
          headers: { 'Content-Type': 'application/json' }
        });

        expect(res.status).to.equal(200);

        res = await this.fetchRecord();
        const json = await res.json();

        expect(json).to.deep.equal({ foo: 'bar' });

        res = await this.fetchRecord({ method: 'DELETE' });
        expect(res.status).to.equal(200);

        res = await this.fetchRecord();
        expect(res.status).to.equal(404);
      });

      it('should intercept', async function() {
        const { server } = this.polly;

        server
          .get('/qp')
          .intercept((req, res) => res.status(200).json(req.query));

        const res = await this.fetch('/qp?foo=bar');
        const json = await res.json();

        expect(res.status).to.equal(200);
        expect(json).to.deep.equal({ foo: 'bar' });
      });

      it('should passthrough', async function() {
        const { server, persister, recordingId } = this.polly;

        server.get(this.recordUrl()).passthrough();

        expect(await persister.find(recordingId)).to.be.null;
        expect((await this.fetchRecord()).status).to.equal(404);
        expect(await persister.find(recordingId)).to.be.null;
      });

      it('should be able to intercept when in passthrough mode', async function() {
        const { server } = this.polly;

        this.polly.configure({ mode: 'passthrough' });

        server
          .get('/ping')
          .intercept((req, res) => res.status(200).send('pong'));

        const res = await this.fetch('/ping');
        const text = await res.text();

        expect(res.status).to.equal(200);
        expect(text).to.equal('pong');
      });

      it('should be able to abort from an intercept', async function() {
        const { server } = this.polly;
        let responseCalled = false;

        server
          .get(this.recordUrl())
          .intercept((req, res, interceptor) => interceptor.abort())
          .on('response', req => {
            responseCalled = true;
            expect(req.action).to.not.equal(ACTIONS.INTERCEPT);
          });

        expect((await this.fetchRecord()).status).to.equal(404);
        expect(responseCalled).to.be.true;
      });

      it('should be able to passthrough from an intercept', async function() {
        const { server, persister, recordingId } = this.polly;
        let responseCalled = false;

        server
          .get(this.recordUrl())
          .intercept((req, res, interceptor) => interceptor.passthrough())
          .on('response', req => {
            responseCalled = true;
            expect(req.action).to.equal(ACTIONS.PASSTHROUGH);
          });

        expect(await persister.find(recordingId)).to.be.null;
        expect((await this.fetchRecord()).status).to.equal(404);
        expect(await persister.find(recordingId)).to.be.null;
        expect(responseCalled).to.be.true;
      });

      it('should handle recording requests posting FormData + Blob/File', async function() {
        const { server, recordingName } = this.polly;
        const form = new FormData();

        form.append('string', recordingName);
        form.append('array', [recordingName, recordingName]);
        form.append('blob', new Blob([recordingName], { type: 'text/plain' }));
        form.append('file', new File([recordingName], 'test.txt'));

        server.post('/submit').intercept((req, res) => {
          const body = req.serializedBody;

          // Make sure the form data exists in the identifiers
          expect(req.identifiers.body).to.include(recordingName);

          expect(body).to.include(`string=${recordingName}`);
          expect(body).to.include(
            `array=${[recordingName, recordingName].toString()}`
          );
          expect(body).to.include(
            `blob=data:text/plain;base64,${btoa(recordingName)}`
          );
          expect(body).to.include(`file=data:;base64,${btoa(recordingName)}`);

          res.sendStatus(200);
        });

        const res = await this.fetch('/submit', { method: 'POST', body: form });

        expect(res.status).to.equal(200);
      });

      it('should handle recording requests posting a Blob', async function() {
        const { server, recordingName } = this.polly;

        server.post('/submit').intercept((req, res) => {
          const dataUrl = `data:text/plain;base64,${btoa(recordingName)}`;

          // Make sure the form data exists in the identifiers
          expect(req.identifiers.body).to.equal(dataUrl);

          expect(req.serializedBody).to.equal(dataUrl);

          res.sendStatus(200);
        });

        const res = await this.fetch('/submit', {
          method: 'POST',
          body: new Blob([recordingName], { type: 'text/plain' })
        });

        expect(res.status).to.equal(200);
      });
    });
  }
});
