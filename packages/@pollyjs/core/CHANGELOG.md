# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/v2.0.0...v2.1.0) (2019-02-04)


### Features

* **core:** Add removeHeader, removeHeaders, and allow empty headers ([#176](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/176)) ([1dfae5a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/1dfae5a))





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/v1.4.2...v2.0.0) (2019-01-29)


### Features

* Make PollyRequest.respond accept a response object ([#168](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/168)) ([5b07b26](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/5b07b26))


*  feat(adapter-node-http): Use `nock` under the hood instead of custom implementation (#166) ([62374f4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/62374f4)), closes [#166](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/166)


### BREAKING CHANGES

* The node-http adapter no longer accepts the `transports` option
* Any adapters calling `pollyRequest.respond` should pass it a response object instead of the previous 3 arguments (statusCode, headers, body).





## [1.4.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/v1.4.1...v1.4.2) (2019-01-16)


### Bug Fixes

* **adapter-node-http:** Fix unhandled rejection if connection fails ([#160](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/160)) ([12fcfa7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/12fcfa7))





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/core





# [1.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/v1.3.2...v1.4.0) (2018-12-07)

**Note:** Version bump only for package @pollyjs/core





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/core





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/v1.2.0...v1.3.1) (2018-11-28)


### Bug Fixes

* Support URL objects ([#139](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/139)) ([cf0d755](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/cf0d755))
* **core:** Handle trailing slashes when generating route names ([#142](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/142)) ([19147f7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/19147f7))
* **core:** Ignore `context` options from being deep merged ([#144](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/144)) ([2123d83](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/2123d83))
* **core:** Support multiple handlers for same paths ([#141](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/141)) ([79e04b8](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/79e04b8))


### Features

* **core:** Support custom functions in matchRequestsBy config options ([#138](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/138)) ([626a84c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/626a84c))
* Add an onIdentifyRequest hook to allow adapter level serialization ([#140](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/140)) ([548002c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/548002c))





      <a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* Changes self to global, rollup-plugin-node-globals makes isomorphic ([#54](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/54)) ([3811e9d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/3811e9d))
* Correctly normalize relative URLs ([b9b23cd](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/b9b23cd))
* Creator cleanup and persister assertion ([#67](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/67)) ([19fee5a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/19fee5a))
* Improve support for relative URLs ([#78](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/78)) ([2c0083e](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/2c0083e)), closes [#76](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/76)
* Proxy route.params onto the request instead of mutating req ([5bcd4f9](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/5bcd4f9))
* **adapter-puppeteer:** Do not intercept CORS preflight requests ([#90](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/90)) ([53ad433](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/53ad433))
* **core:** Freeze request after emitting afterResponse. ([66a2b64](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/66a2b64))
* **core:** Set `url` on the fetch Response object ([#44](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/44)) ([f5980cf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/f5980cf)), closes [#43](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/43)


### Features

* Abort and passthrough from an intercept ([#57](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/57)) ([4ebacb8](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/4ebacb8))
* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/0a3d591))
* Cleanup event handler logic + rename some event names ([78dbb5d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/78dbb5d))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/e622640))
* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/8bb313c))
* Fetch adapter support for `context` provided via adapterOptions ([#66](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/66)) ([82ebd09](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/82ebd09))
* Improved adapter and persister registration ([#62](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/62)) ([164dbac](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/164dbac))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/29ed8e1))
* Move more response methods to shared base class ([#74](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/74)) ([4f845e5](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/4f845e5))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/0a0eeca))
* Presets persisterOptions.host to the node server default ([0b47838](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/0b47838))
* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/f902c6d))
* Use status code 204 in place of 404. ([#5](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/5)) ([930c492](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/930c492))
* **core:** Add `json` property to `Request` ([bb8e1cb](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/bb8e1cb)), closes [#7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/7)
* **core:** Default `Response` status code to 200 ([f42a281](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/f42a281)), closes [#6](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/6)
* Wait for all handled requests to resolve via `.flush()` ([#75](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/75)) ([a3113b7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/a3113b7))
* **core:** Normalize headers by lower-casing all keys ([#42](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/42)) ([02a4767](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/02a4767))
* **core:** Server level configuration ([#80](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/80)) ([0f32d9b](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/0f32d9b))
* **persister:** Add `keepUnusedRequests` config option ([#108](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/108)) ([3f5f5b2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/3f5f5b2))
* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/a04d7a7))


### Reverts

* Add `json` property to `Request` ([4ea50e8](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/4ea50e8))


### BREAKING CHANGES

* __Adapters__

```js
import { XHRAdapter, FetchAdapter } from '@pollyjs/core';

// Register the xhr adapter so its accessible by all future polly instances
Polly.register(XHRAdapter);

polly.configure({
adapters: ['xhr', FetchAdapter]
});
```

__Persister__

```js
import { LocalStoragePersister, RESTPersister } from '@pollyjs/core';

// Register the local-storage persister so its accessible by all future polly instances
Polly.register(LocalStoragePersister);

polly.configure({
persister: 'local-storage'
});

polly.configure({
persister: RESTPersister
});
```
* Recordings now produce HAR compliant json. Please delete existing recordings.
* **core:** With this change, request ids will resolve to a different hash meaning that users will have to rerecord.
* Relative URLs will have different hashes and will
require to re-record.




      <a name="1.1.4"></a>
## [1.1.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@1.1.3...@pollyjs/core@1.1.4) (2018-08-22)




**Note:** Version bump only for package @pollyjs/core

<a name="1.1.1"></a>
## [1.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@1.1.0...@pollyjs/core@1.1.1) (2018-08-09)




**Note:** Version bump only for package @pollyjs/core

<a name="1.1.0"></a>
# [1.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@1.0.0...@pollyjs/core@1.1.0) (2018-07-26)


### Bug Fixes

* Improve support for relative URLs ([#78](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/78)) ([2c0083e](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/2c0083e)), closes [#76](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/76)


### Features

* Move more response methods to shared base class ([#74](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/74)) ([4f845e5](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/4f845e5))
* Wait for all handled requests to resolve via `.flush()` ([#75](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/75)) ([a3113b7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/a3113b7))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.5.0...@pollyjs/core@1.0.0) (2018-07-20)


### Bug Fixes

* Changes self to global, rollup-plugin-node-globals makes isomorphic ([#54](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/54)) ([3811e9d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/3811e9d))
* Creator cleanup and persister assertion ([#67](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/67)) ([19fee5a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/19fee5a))


### Features

* Abort and passthrough from an intercept ([#57](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/57)) ([4ebacb8](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/4ebacb8))
* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/0a3d591))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/e622640))
* Fetch adapter support for `context` provided via adapterOptions ([#66](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/66)) ([82ebd09](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/82ebd09))
* Improved adapter and persister registration ([#62](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/62)) ([164dbac](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/164dbac))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/29ed8e1))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/0a0eeca))
* Presets persisterOptions.host to the node server default ([0b47838](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/0b47838))
* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/f902c6d))


### BREAKING CHANGES

* __Adapters__

```js
import { XHRAdapter, FetchAdapter } from '@pollyjs/core';

// Register the xhr adapter so its accessible by all future polly instances
Polly.register(XHRAdapter);

polly.configure({
adapters: ['xhr', FetchAdapter]
});
```

__Persister__

```js
import { LocalStoragePersister, RESTPersister } from '@pollyjs/core';

// Register the local-storage persister so its accessible by all future polly instances
Polly.register(LocalStoragePersister);

polly.configure({
persister: 'local-storage'
});

polly.configure({
persister: RESTPersister
});
```
* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="0.5.0"></a>
# [0.5.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.4.0...@pollyjs/core@0.5.0) (2018-06-27)


### Bug Fixes

* **core:** Set `url` on the fetch Response object ([#44](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/44)) ([f5980cf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/f5980cf)), closes [#43](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/43)


### Features

* **core:** Normalize headers by lower-casing all keys ([#42](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/42)) ([02a4767](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/02a4767))


### BREAKING CHANGES

* **core:** With this change, request ids will resolve to a different hash meaning that users will have to rerecord.




<a name="0.4.0"></a>
# [0.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.3.0...@pollyjs/core@0.4.0) (2018-06-22)


### Bug Fixes

* Correctly normalize relative URLs ([b9b23cd](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/b9b23cd))


### BREAKING CHANGES

* Relative URLs will have different hashes and will
require to re-record.




<a name="0.3.0"></a>
# [0.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.2.0...@pollyjs/core@0.3.0) (2018-06-21)


### Features

* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/a04d7a7))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.1.0...@pollyjs/core@0.2.0) (2018-06-16)


### Features

* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/8bb313c))
