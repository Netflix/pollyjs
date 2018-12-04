# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.2](https://github.com/netflix/pollyjs/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package pollyjs





## [1.3.1](https://github.com/netflix/pollyjs/compare/v1.2.0...v1.3.1) (2018-11-28)


### Bug Fixes

* Support URL objects ([#139](https://github.com/netflix/pollyjs/issues/139)) ([cf0d755](https://github.com/netflix/pollyjs/commit/cf0d755))
* **core:** Handle trailing slashes when generating route names ([#142](https://github.com/netflix/pollyjs/issues/142)) ([19147f7](https://github.com/netflix/pollyjs/commit/19147f7))
* **core:** Ignore `context` options from being deep merged ([#144](https://github.com/netflix/pollyjs/issues/144)) ([2123d83](https://github.com/netflix/pollyjs/commit/2123d83))
* **core:** Support multiple handlers for same paths ([#141](https://github.com/netflix/pollyjs/issues/141)) ([79e04b8](https://github.com/netflix/pollyjs/commit/79e04b8))


### Features

* **core:** Support custom functions in matchRequestsBy config options ([#138](https://github.com/netflix/pollyjs/issues/138)) ([626a84c](https://github.com/netflix/pollyjs/commit/626a84c))
* Add an onIdentifyRequest hook to allow adapter level serialization ([#140](https://github.com/netflix/pollyjs/issues/140)) ([548002c](https://github.com/netflix/pollyjs/commit/548002c))





      <a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* **adapter-puppeteer:** Do not intercept CORS preflight requests ([#90](https://github.com/netflix/pollyjs/issues/90)) ([53ad433](https://github.com/netflix/pollyjs/commit/53ad433))
* Changes self to global, rollup-plugin-node-globals makes isomorphic ([#54](https://github.com/netflix/pollyjs/issues/54)) ([3811e9d](https://github.com/netflix/pollyjs/commit/3811e9d))
* **core:** Freeze request after emitting afterResponse. ([66a2b64](https://github.com/netflix/pollyjs/commit/66a2b64))
* Allow 204 responses without a body ([#101](https://github.com/netflix/pollyjs/issues/101)) ([20b4125](https://github.com/netflix/pollyjs/commit/20b4125))
* Browser (UMD) build now bundles corejs ([#106](https://github.com/netflix/pollyjs/issues/106)) ([ec62fc0](https://github.com/netflix/pollyjs/commit/ec62fc0))
* Bumping core within Ember ([af4faa1](https://github.com/netflix/pollyjs/commit/af4faa1))
* Config expiresIn can contain periods. i.e, 1.5 weeks ([e9c7aaa](https://github.com/netflix/pollyjs/commit/e9c7aaa))
* Correctly normalize relative URLs ([b9b23cd](https://github.com/netflix/pollyjs/commit/b9b23cd))
* Creator cleanup and persister assertion ([#67](https://github.com/netflix/pollyjs/issues/67)) ([19fee5a](https://github.com/netflix/pollyjs/commit/19fee5a))
* Do not display node server listening banner in quiet mode ([1be57a7](https://github.com/netflix/pollyjs/commit/1be57a7))
* Ensure polly's middleware goes before ember-cli's ([#36](https://github.com/netflix/pollyjs/issues/36)) ([43db361](https://github.com/netflix/pollyjs/commit/43db361))
* Improve support for relative URLs ([#78](https://github.com/netflix/pollyjs/issues/78)) ([2c0083e](https://github.com/netflix/pollyjs/commit/2c0083e)), closes [#76](https://github.com/netflix/pollyjs/issues/76)
* Loosen up global XHR native check ([#69](https://github.com/netflix/pollyjs/issues/69)) ([79cdd96](https://github.com/netflix/pollyjs/commit/79cdd96))
* Proxy route.params onto the request instead of mutating req ([5bcd4f9](https://github.com/netflix/pollyjs/commit/5bcd4f9))
* Puppeteer 1.7.0 support ([#100](https://github.com/netflix/pollyjs/issues/100)) ([e208b38](https://github.com/netflix/pollyjs/commit/e208b38))
* Puppeteer CORS request matching ([#110](https://github.com/netflix/pollyjs/issues/110)) ([7831115](https://github.com/netflix/pollyjs/commit/7831115))
* Rest server on Windows ([be5c473](https://github.com/netflix/pollyjs/commit/be5c473))
* **core:** Set `url` on the fetch Response object ([#44](https://github.com/netflix/pollyjs/issues/44)) ([f5980cf](https://github.com/netflix/pollyjs/commit/f5980cf)), closes [#43](https://github.com/netflix/pollyjs/issues/43)
* **ember:** Fix auto-register and add tests to cover ([24c15bd](https://github.com/netflix/pollyjs/commit/24c15bd))
* **persister:** Handle concurrent find requests ([#88](https://github.com/netflix/pollyjs/issues/88)) ([0e02414](https://github.com/netflix/pollyjs/commit/0e02414))


### Features

* Abort and passthrough from an intercept ([#57](https://github.com/netflix/pollyjs/issues/57)) ([4ebacb8](https://github.com/netflix/pollyjs/commit/4ebacb8))
* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/commit/0a3d591))
* Cleanup event handler logic + rename some event names ([78dbb5d](https://github.com/netflix/pollyjs/commit/78dbb5d))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/issues/45)) ([e622640](https://github.com/netflix/pollyjs/commit/e622640))
* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/commit/8bb313c))
* Fetch adapter support for `context` provided via adapterOptions ([#66](https://github.com/netflix/pollyjs/issues/66)) ([82ebd09](https://github.com/netflix/pollyjs/commit/82ebd09))
* Improved adapter and persister registration ([#62](https://github.com/netflix/pollyjs/issues/62)) ([164dbac](https://github.com/netflix/pollyjs/commit/164dbac))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/commit/29ed8e1))
* Make recording size limit configurable ([#40](https://github.com/netflix/pollyjs/issues/40)) ([d4be431](https://github.com/netflix/pollyjs/commit/d4be431))
* Move more response methods to shared base class ([#74](https://github.com/netflix/pollyjs/issues/74)) ([4f845e5](https://github.com/netflix/pollyjs/commit/4f845e5))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/commit/0a0eeca))
* Presets persisterOptions.host to the node server default ([0b47838](https://github.com/netflix/pollyjs/commit/0b47838))
* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/commit/f902c6d))
* Use status code 204 in place of 404. ([#5](https://github.com/netflix/pollyjs/issues/5)) ([930c492](https://github.com/netflix/pollyjs/commit/930c492))
* **core:** Add `json` property to `Request` ([bb8e1cb](https://github.com/netflix/pollyjs/commit/bb8e1cb)), closes [#7](https://github.com/netflix/pollyjs/issues/7)
* **core:** Default `Response` status code to 200 ([f42a281](https://github.com/netflix/pollyjs/commit/f42a281)), closes [#6](https://github.com/netflix/pollyjs/issues/6)
* Wait for all handled requests to resolve via `.flush()` ([#75](https://github.com/netflix/pollyjs/issues/75)) ([a3113b7](https://github.com/netflix/pollyjs/commit/a3113b7))
* **core:** Normalize headers by lower-casing all keys ([#42](https://github.com/netflix/pollyjs/issues/42)) ([02a4767](https://github.com/netflix/pollyjs/commit/02a4767))
* **core:** Server level configuration ([#80](https://github.com/netflix/pollyjs/issues/80)) ([0f32d9b](https://github.com/netflix/pollyjs/commit/0f32d9b))
* **node-server:** Add cors support to express server to pass-through all requests ([223ce4e](https://github.com/netflix/pollyjs/commit/223ce4e))
* **persister:** Add `keepUnusedRequests` config option ([#108](https://github.com/netflix/pollyjs/issues/108)) ([3f5f5b2](https://github.com/netflix/pollyjs/commit/3f5f5b2))
* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/commit/a04d7a7))


### Reverts

* "Update commitlint.config.js" ([65e6996](https://github.com/netflix/pollyjs/commit/65e6996))
* Add `json` property to `Request` ([4ea50e8](https://github.com/netflix/pollyjs/commit/4ea50e8))
* Revert "Update commitlint.config.js" ([6624cb5](https://github.com/netflix/pollyjs/commit/6624cb5))
* Revert Use docsify GA plugin ([35ace6f](https://github.com/netflix/pollyjs/commit/35ace6f))
* Use docsify GA plugin ([cf5f1c5](https://github.com/netflix/pollyjs/commit/cf5f1c5))


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




      # Changelog
