import { MODES, EXPIRY_STRATEGIES } from '@pollyjs/utils';

import Timing from '../utils/timing';

export default {
  mode: MODES.REPLAY,

  adapters: [],
  adapterOptions: {},

  persister: null,
  persisterOptions: {
    keepUnusedRequests: false,
    disableSortingHarEntries: false
  },

  logging: false,
  flushRequestsOnStop: false,

  recordIfMissing: true,
  recordFailedRequests: false,

  expiresIn: null,
  expiryStrategy: EXPIRY_STRATEGIES.WARN,
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
