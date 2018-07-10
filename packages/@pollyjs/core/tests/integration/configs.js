const common = {
  recordFailedRequests: true,
  persisterOptions: {
    rest: { host: '' }
  }
};

export default {
  'XHR Adapter + Rest Persister': {
    adapters: ['xhr'],
    ...common
  },
  'Fetch Adapter + Rest Persister': {
    adapters: ['fetch'],
    ...common
  },
  'Fetch Adapter + Local Storage Persister': {
    adapters: ['fetch'],
    persister: 'local-storage',
    ...common
  },
  'XHR Adapter + Local Storage Persister': {
    adapters: ['xhr'],
    persister: 'local-storage',
    ...common
  }
};
