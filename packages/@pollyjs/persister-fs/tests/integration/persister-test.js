// import FSPersister from '../../src';
// import setupPersister from '@pollyjs-tests/helpers/setup-persister';
// import setupFetchRecord from '@pollyjs-tests/helpers/setup-fetch-record';
// import persisterTests from '@pollyjs-tests/integration/persister-tests';
// import { setupMocha as setupPolly, FetchAdapter } from '@pollyjs/core';

// // TODO: re-enable once the fetch adapter can accept a context
// describe.skip('Integration | FS Persister', function() {
//   setupPolly.beforeEach({
//     adapters: [FetchAdapter],
//     persister: FSPersister
//   });

//   beforeEach(function() {
//     this.fetch = (...args) => fetch(...args);
//   });

//   setupFetchRecord()
//   setupPersister();
//   setupPolly.afterEach();

//   persisterTests();
// });
