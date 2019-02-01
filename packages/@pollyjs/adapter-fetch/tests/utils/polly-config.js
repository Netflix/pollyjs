import RESTPersister from '@pollyjs/persister-rest';

import FetchAdapter from '../../src';

export default {
  recordFailedRequests: true,
  adapters: [FetchAdapter],
  persister: RESTPersister,
  persisterOptions: {
    rest: { host: '' }
  }
};
