import { MODES } from '@pollyjs/utils';
import Timing from '../utils/timing';

export interface PollyConfig {
  mode: string;
  logging: boolean;
  recordIfMissing: boolean;
  recordIfExpired: boolean;
  recordFailedRequests: boolean;
  expiresIn?: string | null;
  timing: Function;
  adapters: (string | Function)[];
  adapterOptions: {};
  persister?: string | Function | null;
  persisterOptions: {};

  matchRequestsBy: {
    method: boolean;
    headers: boolean | { excludes: string[] };
    body: boolean;
    order: boolean;
    url: {
      protocol: boolean;
      username: boolean;
      password: boolean;
      hostname: boolean;
      port: boolean;
      pathname: boolean;
      query: boolean;
      hash: boolean;
    }
  }
}

export default {
  mode: MODES.REPLAY,
  logging: false,
  recordIfMissing: true,
  recordIfExpired: false,
  recordFailedRequests: false,
  expiresIn: null,
  timing: Timing.fixed(0),

  adapters: [],
  adapterOptions: {},

  persister: null,
  persisterOptions: {},

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
} as PollyConfig;
