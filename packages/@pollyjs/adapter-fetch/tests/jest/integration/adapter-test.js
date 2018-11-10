import '@pollyjs-tests/helpers/global-fetch';

import { Polly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';

import FetchAdapter from '../../../src';

describe('Integration | Fetch Adapter | Jest', function() {
  let polly;

  beforeEach(() => {
    polly = new Polly('Integration | Fetch Adapter | Jest', {
      recordFailedRequests: true,
      adapters: [FetchAdapter],
      persister: FSPersister,
      persisterOptions: {
        fs: { recordingsDir: 'tests/recordings' }
      }
    });
  });

  afterEach(async () => await polly.stop());

  test('it works', async () => {
    polly.recordingName += '/it works';

    const { persister, recordingId } = polly;

    expect((await fetch('http://localhost:4000/api/db/foo')).status).toBe(404);
    await persister.persist();

    const har = await persister.find(recordingId);

    expect(har).toBeDefined();
    expect(har.log.entries.length).toBe(1);
    expect(har.log.entries[0].request.url.includes('/api/db/foo')).toBe(true);
    expect(har.log.entries[0].response.status).toBe(404);

    await persister.delete(recordingId);
    expect(persister.find(recordingId)).resolves.toBeNull();
  });
});
