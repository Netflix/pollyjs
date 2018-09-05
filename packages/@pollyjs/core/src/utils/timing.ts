import { timeout } from '@pollyjs/utils';

export default {
  fixed(ms: number) {
    return () => timeout(ms);
  },

  relative(ratio: number) {
    return (ms: number) => timeout(ratio * ms);
  }
};
