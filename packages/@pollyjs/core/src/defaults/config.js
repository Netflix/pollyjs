import { MODES } from '@pollyjs/utils';

import Timing from '../utils/timing';

export default {
  mode: MODES.REPLAY,

  adapters: [],
  adapterOptions: {},

  persister: null,
  persisterOptions: {
    keepUnusedRequests: false
  },

  logging: false,

  recordIfMissing: true,
  recordIfExpired: false,
  recordFailedRequests: false,

  expiresIn: null,
  timing: Timing.fixed(0),

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
