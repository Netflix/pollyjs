export default {
  'XHR Adapter + Rest Persister': {
    adapters: ['xhr'],
    recordFailedRequests: true
  },
  'Fetch Adapter + Rest Persister': {
    adapters: ['fetch'],
    recordFailedRequests: true
  },
  'Fetch Adapter + Local Storage Persister': {
    adapters: ['fetch'],
    persister: 'local-storage',
    recordFailedRequests: true
  },
  'XHR Adapter + Local Storage Persister': {
    adapters: ['xhr'],
    persister: 'local-storage',
    recordFailedRequests: true
  }
};
