import {
  XHRAdapter,
  FetchAdapter,
  RESTPersister,
  LocalStoragePersister
} from '../../../src';

const common = {
  recordFailedRequests: true,
  persisterOptions: {
    rest: { host: '' }
  }
};

export default {
  'XHR Adapter + Rest Persister': {
    adapters: [XHRAdapter],
    persister: RESTPersister,
    ...common
  },
  'Fetch Adapter + Rest Persister': {
    adapters: [FetchAdapter],
    persister: RESTPersister,
    ...common
  },
  'Fetch Adapter + Local Storage Persister': {
    adapters: [FetchAdapter],
    persister: LocalStoragePersister,
    ...common
  },
  'XHR Adapter + Local Storage Persister': {
    adapters: [XHRAdapter],
    persister: LocalStoragePersister,
    ...common
  }
};
