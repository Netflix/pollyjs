import { Polly } from '@pollyjs/core';
import RESTPersister from '@pollyjs/persister-rest';

import XHRAdapter from '../../../src';

function request(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function() {
      resolve(xhr);
    });

    xhr.addEventListener('error', reject);
    xhr.open('GET', url, true);
    xhr.send();
  });
}

describe('Integration | XHR Adapter | Jest', function() {
  let polly;

  beforeEach(() => {
    polly = new Polly('Integration | XHR Adapter | Jest', {
      recordFailedRequests: true,
      adapters: [XHRAdapter],
      persister: RESTPersister,
      persisterOptions: {
        rest: { host: '' }
      }
    });
  });

  afterEach(async () => await polly.stop());

  test('it works', async () => {
    polly.recordingName += '/it works';

    const { persister, recordingId } = polly;

    expect((await request('/api/db/foo')).status).toBe(404);
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
