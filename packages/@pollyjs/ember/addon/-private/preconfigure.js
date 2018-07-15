import { Polly } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';
import RESTPersister from '@pollyjs/persister-rest';
import LocalStoragePersister from '@pollyjs/persister-local-storage';

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
