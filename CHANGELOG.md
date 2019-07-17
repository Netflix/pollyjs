# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.6.0](https://github.com/netflix/pollyjs/compare/v2.5.0...v2.6.0) (2019-07-17)


### Bug Fixes

* **adapter-fetch:** Handle `Request` objects as URLs ([#220](https://github.com/netflix/pollyjs/issues/220)) ([bb28d54](https://github.com/netflix/pollyjs/commit/bb28d54))


### Features

* **core:** Improved logging ([#217](https://github.com/netflix/pollyjs/issues/217)) ([3e876a8](https://github.com/netflix/pollyjs/commit/3e876a8))
* PollyError and improved adapter error handling ([#234](https://github.com/netflix/pollyjs/issues/234)) ([23a2127](https://github.com/netflix/pollyjs/commit/23a2127))





# [2.5.0](https://github.com/netflix/pollyjs/compare/v2.4.0...v2.5.0) (2019-06-06)


### Features

* **adapter-xhr:** Support `context` option ([65b3c38](https://github.com/netflix/pollyjs/commit/65b3c38))





# [2.4.0](https://github.com/netflix/pollyjs/compare/v2.3.2...v2.4.0) (2019-04-27)


### Features

* **core:** Improved control flow with `times` and `stopPropagation` ([#202](https://github.com/netflix/pollyjs/issues/202)) ([2c8231e](https://github.com/netflix/pollyjs/commit/2c8231e))





## [2.3.2](https://github.com/netflix/pollyjs/compare/v2.3.1...v2.3.2) (2019-04-09)


### Bug Fixes

* **adapter-puppeteer:** Remove other resource type matching ([#197](https://github.com/netflix/pollyjs/issues/197)) ([ea6bfcc](https://github.com/netflix/pollyjs/commit/ea6bfcc))





## [2.3.1](https://github.com/netflix/pollyjs/compare/v2.3.0...v2.3.1) (2019-03-06)


### Bug Fixes

* **adapter-fetch:** Correctly handle key/value pairs headers ([dc0323d](https://github.com/netflix/pollyjs/commit/dc0323d))





# [2.3.0](https://github.com/netflix/pollyjs/compare/v2.2.0...v2.3.0) (2019-02-27)


### Features

* **core:** Filter requests matched by a route handler ([#189](https://github.com/netflix/pollyjs/issues/189)) ([5d57c32](https://github.com/netflix/pollyjs/commit/5d57c32))





# [2.2.0](https://github.com/netflix/pollyjs/compare/v2.1.0...v2.2.0) (2019-02-20)


### Features

* Add `error` event and improve error handling ([#185](https://github.com/netflix/pollyjs/issues/185)) ([3694ebc](https://github.com/netflix/pollyjs/commit/3694ebc))





# [2.1.0](https://github.com/netflix/pollyjs/compare/v2.0.0...v2.1.0) (2019-02-04)


### Bug Fixes

* **adapter:** Log information if request couldn't be found in recording ([#172](https://github.com/netflix/pollyjs/issues/172)) ([8dcdf7b](https://github.com/netflix/pollyjs/commit/8dcdf7b))
* **adapter-xhr:** Xhr.send should not be an async method ([#173](https://github.com/netflix/pollyjs/issues/173)) ([eb3a6eb](https://github.com/netflix/pollyjs/commit/eb3a6eb))
* Correctly handle array header values ([#179](https://github.com/netflix/pollyjs/issues/179)) ([fb7dbb4](https://github.com/netflix/pollyjs/commit/fb7dbb4))


### Features

* **core:** Add removeHeader, removeHeaders, and allow empty headers ([#176](https://github.com/netflix/pollyjs/issues/176)) ([1dfae5a](https://github.com/netflix/pollyjs/commit/1dfae5a))





# [2.0.0](https://github.com/netflix/pollyjs/compare/v1.4.2...v2.0.0) (2019-01-29)


*  feat(adapter-node-http): Use `nock` under the hood instead of custom implementation (#166) ([62374f4](https://github.com/netflix/pollyjs/commit/62374f4)), closes [#166](https://github.com/netflix/pollyjs/issues/166)


### Bug Fixes

* **adapter:** Test for navigator before accessing ([#165](https://github.com/netflix/pollyjs/issues/165)) ([7200255](https://github.com/netflix/pollyjs/commit/7200255))
* **ember:** Remove Node 6 from supported versions ([#169](https://github.com/netflix/pollyjs/issues/169)) ([07b2b4e](https://github.com/netflix/pollyjs/commit/07b2b4e))
* **persister:** Only persist post data if a request has a body ([#171](https://github.com/netflix/pollyjs/issues/171)) ([f62d318](https://github.com/netflix/pollyjs/commit/f62d318))


### chore

* Remove support for Node 6 ([#167](https://github.com/netflix/pollyjs/issues/167)) ([a08a8cf](https://github.com/netflix/pollyjs/commit/a08a8cf))


### Features

* Make PollyRequest.respond accept a response object ([#168](https://github.com/netflix/pollyjs/issues/168)) ([5b07b26](https://github.com/netflix/pollyjs/commit/5b07b26))
* Simplify adapter implementation ([#154](https://github.com/netflix/pollyjs/issues/154)) ([12c8601](https://github.com/netflix/pollyjs/commit/12c8601))


### BREAKING CHANGES

* The node-http adapter no longer accepts the `transports` option
* Any adapters calling `pollyRequest.respond` should pass it a response object instead of the previous 3 arguments (statusCode, headers, body).
* Polly will no longer actively support Node 6
* Changes to the base adapter implementation and external facing API





## [1.4.2](https://github.com/netflix/pollyjs/compare/v1.4.1...v1.4.2) (2019-01-16)


### Bug Fixes

* **adapter-node-http:** Fix unhandled rejection if connection fails ([#160](https://github.com/netflix/pollyjs/issues/160)) ([12fcfa7](https://github.com/netflix/pollyjs/commit/12fcfa7))
* **adapter-node-http:** Pause socket on original request ([#162](https://github.com/netflix/pollyjs/issues/162)) ([8f0c56c](https://github.com/netflix/pollyjs/commit/8f0c56c))


### Features

* Lint other filetypes with prettier ([#152](https://github.com/netflix/pollyjs/issues/152)) ([78d1af8](https://github.com/netflix/pollyjs/commit/78d1af8))





## [1.4.1](https://github.com/netflix/pollyjs/compare/v1.4.0...v1.4.1) (2018-12-13)


### Bug Fixes

* **utils:** Support arrays & nested objects in query params ([#148](https://github.com/netflix/pollyjs/issues/148)) ([7e846b0](https://github.com/netflix/pollyjs/commit/7e846b0))





# [1.4.0](https://github.com/netflix/pollyjs/compare/v1.3.2...v1.4.0) (2018-12-07)


### Bug Fixes

* **adapter-fetch:** Deprecate usage in Node in favor of node-http ([#146](https://github.com/netflix/pollyjs/issues/146)) ([001ccdd](https://github.com/netflix/pollyjs/commit/001ccdd))


### Features

* Node HTTP Adapter ([#128](https://github.com/netflix/pollyjs/issues/128)) ([fa059a4](https://github.com/netflix/pollyjs/commit/fa059a4))





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
