import { timeout } from '@pollyjs/utils';

export default {
  fixed(ms) {
    return () => timeout(ms);
  },

  relative(ratio) {
    return ms => timeout(ratio * ms);
  }
};
