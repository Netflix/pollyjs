import InMemoryPersister from '@pollyjs/persister-in-memory';

import NodeHttpAdapter from '../../src';

export default {
  recordFailedRequests: true,
  adapters: [NodeHttpAdapter],
  persister: InMemoryPersister,
  persisterOptions: {}
};
