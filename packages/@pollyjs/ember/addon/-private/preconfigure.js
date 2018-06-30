import { Polly } from '@pollyjs/core';

Polly.configure({
  /**
   * @pollyjs/ember mounts the express middleware onto to the running
   * testem and ember-cli express server and a relative host (an empty `host`)
   * is preferred here.  Can be overridden at runtime in cases where the
   * Polly server is externally hosted.
   */
  persisterOptions: {
    host: ''
  }
});

export default Polly;
