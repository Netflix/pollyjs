import FSPersister from '@pollyjs/persister-fs';

import NodeHttpAdapter from '../../src';

export default {
  recordFailedRequests: true,
  adapters: [NodeHttpAdapter],
  persister: FSPersister,
  persisterOptions: {
    fs: { recordingsDir: 'tests/recordings' }
  }
};
