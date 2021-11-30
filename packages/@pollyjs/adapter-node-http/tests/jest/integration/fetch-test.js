import '@pollyjs-tests/helpers/global-node-fetch';

import { Polly } from '@pollyjs/core';

import pollyConfig from '../../utils/polly-config';

describe('Integration | Jest | Fetch', function () {
  let polly;

  beforeEach(() => {
    polly = new Polly('Integration | Jest | Fetch', pollyConfig);
  });

  afterEach(async () => await polly.stop());

  test('it works', async () => {
    polly.recordingName += '/it works';

    const { persister, recordingId } = polly;

    expect((await fetch('http://localhost:4000/api/db/foo')).status).toBe(404);
    await persister.persist();

    const har = await persister.findRecording(recordingId);

    expect(har).toBeDefined();
    expect(har.log.entries.length).toBe(1);
    expect(har.log.entries[0].request.url.includes('/api/db/foo')).toBe(true);
    expect(har.log.entries[0].response.status).toBe(404);

    await persister.deleteRecording(recordingId);
    expect(persister.findRecording(recordingId)).resolves.toBeNull();
  });
});
