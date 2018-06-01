import Modes from './modes';
import Timing from '../utils/timing';

export default {
  mode: Modes.REPLAY,
  adapters: ['fetch', 'xhr'],

  logging: false,

  recordIfMissing: true,
  recordIfExpired: false,
  recordFailedRequests: false,

  expiresIn: null,
  timing: Timing.fixed(0),

  persister: 'rest',
  persisterOptions: {
    host: '',
    namespace: '/polly'
  },

  matchRequestsBy: {
    method: true,
    headers: true,
    body: true,
    order: true,

    url: {
      protocol: true,
      username: true,
      password: true,
      hostname: true,
      port: true,
      pathname: true,
      query: true,
      hash: false
    }
  }
};
