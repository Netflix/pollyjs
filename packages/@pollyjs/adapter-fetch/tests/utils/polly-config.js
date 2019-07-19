import InMemoryPersister from '@pollyjs/persister-in-memory';

import FetchAdapter from '../../src';

export default {
  recordFailedRequests: true,
  adapters: [FetchAdapter],
  persister: InMemoryPersister
};
