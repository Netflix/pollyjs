import {
  Polly,
  XHRAdapter,
  FetchAdapter,
  RESTPersister,
  LocalStoragePersister
} from '@pollyjs/core';

Polly.register(XHRAdapter);
Polly.register(FetchAdapter);
Polly.register(RESTPersister);
Polly.register(LocalStoragePersister);

Polly.on('create', polly => {
  polly.configure({
    adapters: ['xhr', 'fetch'],
    persister: 'rest',
    /**
     * @pollyjs/ember mounts the express middleware onto to the running
     * testem and ember-cli express server and a relative host (an empty `host`)
     * is preferred here. Can be overridden at runtime in cases where the
     * Polly server is externally hosted.
     */
    persisterOptions: { rest: { host: '' } }
  });
});

export default Polly;
