# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.6](https://github.com/netflix/pollyjs/compare/v6.0.5...v6.0.6) (2023-07-20)

**Note:** Version bump only for package pollyjs





## [6.0.5](https://github.com/netflix/pollyjs/compare/v6.0.4...v6.0.5) (2022-04-04)


### Bug Fixes

* **persister:** `requests` -> `request` in `HarEntry` declaration ([#441](https://github.com/netflix/pollyjs/issues/441)) ([6466810](https://github.com/netflix/pollyjs/commit/6466810677b6ac2c6a7496335bf40e043ab843e1))





## [6.0.4](https://github.com/netflix/pollyjs/compare/v6.0.3...v6.0.4) (2021-12-10)


### Bug Fixes

* Update types for class methods ([#438](https://github.com/netflix/pollyjs/issues/438)) ([b88655a](https://github.com/netflix/pollyjs/commit/b88655ac1b4ca7348afd45e9aeaa50e998ea68d7))





## [6.0.3](https://github.com/netflix/pollyjs/compare/v6.0.2...v6.0.3) (2021-12-08)


### Bug Fixes

* A few more type fixes ([#437](https://github.com/netflix/pollyjs/issues/437)) ([5e837a2](https://github.com/netflix/pollyjs/commit/5e837a25d28393b764cb66bcae0b29e9273eabe8))





## [6.0.2](https://github.com/netflix/pollyjs/compare/v6.0.1...v6.0.2) (2021-12-07)


### Bug Fixes

* **core:** Fix types for registering adapters and persisters ([#435](https://github.com/netflix/pollyjs/issues/435)) ([cc2fa19](https://github.com/netflix/pollyjs/commit/cc2fa197a5c0a5fdef4602c4a207d31f3e677897))





## [6.0.1](https://github.com/netflix/pollyjs/compare/v6.0.0...v6.0.1) (2021-12-06)


### Bug Fixes

* **ember:** Bump peer dependencies to 6.x ([#432](https://github.com/netflix/pollyjs/issues/432)) ([1529226](https://github.com/netflix/pollyjs/commit/152922688744c8a2f8d89f793dcecf3c2bc40033))
* **types:** add types.d.ts to package.files ([#431](https://github.com/netflix/pollyjs/issues/431)) ([113ee89](https://github.com/netflix/pollyjs/commit/113ee898bcf0467c5c48c15b53fc9198e2e91cb1))





# [6.0.0](https://github.com/netflix/pollyjs/compare/v5.2.0...v6.0.0) (2021-11-30)


### Bug Fixes

* **persister:** Only treat status codes >= 400 as failed ([#430](https://github.com/netflix/pollyjs/issues/430)) ([7658952](https://github.com/netflix/pollyjs/commit/765895232746cd560da6bd566de8a312045b1703))


* fix!: Upgrade url-parse (#426) ([c21ed04](https://github.com/netflix/pollyjs/commit/c21ed048ff9d87a3773458dcfb9758e4fa6582bf)), closes [#426](https://github.com/netflix/pollyjs/issues/426)
* feat!: Cleanup adapter and persister APIs (#429) ([06499fc](https://github.com/netflix/pollyjs/commit/06499fc2d85254b3329db2bec770d173ed32bca0)), closes [#429](https://github.com/netflix/pollyjs/issues/429)
* feat!: Improve logging and add logLevel (#427) ([bef3ee3](https://github.com/netflix/pollyjs/commit/bef3ee39f71dfc2fa4dbeb522dfba16d01243e9f)), closes [#427](https://github.com/netflix/pollyjs/issues/427)
* chore!: Upgrade package dependencies (#421) ([dd23334](https://github.com/netflix/pollyjs/commit/dd23334fa9b64248e4c49c3616237bdc2f12f682)), closes [#421](https://github.com/netflix/pollyjs/issues/421)
* feat!: Use base64 instead of hex encoding for binary data (#420) ([6bb9b36](https://github.com/netflix/pollyjs/commit/6bb9b36522d73f9c079735d9006a12376aee39ea)), closes [#420](https://github.com/netflix/pollyjs/issues/420)
* feat(ember)!: Upgrade to ember octane (#415) ([8559ef8](https://github.com/netflix/pollyjs/commit/8559ef8c600aefaec629870eac5f5c8953e18b16)), closes [#415](https://github.com/netflix/pollyjs/issues/415)


### Features

* **adapter-node-http:** Upgrade nock to v13 ([#424](https://github.com/netflix/pollyjs/issues/424)) ([2d5b59e](https://github.com/netflix/pollyjs/commit/2d5b59ee0c33ea53a64321249246fcae0a616a3f))
* **node-server:** Upgrade dependencies ([#417](https://github.com/netflix/pollyjs/issues/417)) ([246a2f2](https://github.com/netflix/pollyjs/commit/246a2f29a88de9c25fc0739ea5e53a0130a58573))


### BREAKING CHANGES

* Upgrade url-parse to 1.5.0+ to fix CVE-2021-27515. This change could alter the final url generated for a request. 
* Adapter
	- `passthroughRequest` renamed to `onFetchResponse`
	- `respondToRequest` renamed to `onRespond`
* Persister
	- `findRecording` renamed to `onFindRecording`
	- `saveRecording` renamed to `onSaveRecording`
	- `deleteRecording` renamed to `onDeleteRecording`
* The `logging` configuration option has now been replaced with `logLevel`. This allows for more fine-grain control over what should be logged as well as silencing logs altogether. 
* Recording file name will no longer have trailing dashes
* Use the standard `encoding` field on the generated har file instead of `_isBinary` and use `base64` encoding instead of `hex` to reduce the payload size.
	* Although backwards compatibility is not guaranteed, you can replace all occurrences of `"_isBinary": true` with `"encoding": "hex"` in the recorded HAR files.
* @pollyjs dependencies for @pollyjs/ember have been moved to peer dependencies





# [5.2.0](https://github.com/netflix/pollyjs/compare/v5.1.1...v5.2.0) (2021-11-24)


### Features

* **ember:** Upgrade ember-cli-babel to ^7.26.6 ([#411](https://github.com/netflix/pollyjs/issues/411)) ([4352881](https://github.com/netflix/pollyjs/commit/4352881))





## [5.1.1](https://github.com/netflix/pollyjs/compare/v5.1.0...v5.1.1) (2021-06-02)


### Bug Fixes

* Handle failed arraybuffer instanceof checks ([#393](https://github.com/netflix/pollyjs/issues/393)) ([247be0a](https://github.com/netflix/pollyjs/commit/247be0a))





# [5.1.0](https://github.com/netflix/pollyjs/compare/v5.0.2...v5.1.0) (2020-12-12)


### Bug Fixes

* **adapter-puppeteer:** Add prependListener puppeteer@4.0.0 removed ([#368](https://github.com/netflix/pollyjs/issues/368)) ([6c35fd3](https://github.com/netflix/pollyjs/commit/6c35fd3))


### Features

* **core:** Add `overrideRecordingName` and `configure` to public API ([#372](https://github.com/netflix/pollyjs/issues/372)) ([cdbf513](https://github.com/netflix/pollyjs/commit/cdbf513))





## [5.0.2](https://github.com/netflix/pollyjs/compare/v5.0.1...v5.0.2) (2020-12-06)


### Bug Fixes

* **adapter-node-http:** Remove module monkey patching on disconnect ([#369](https://github.com/netflix/pollyjs/issues/369)) ([0cec43a](https://github.com/netflix/pollyjs/commit/0cec43a))





## [5.0.1](https://github.com/netflix/pollyjs/compare/v5.0.0...v5.0.1) (2020-09-25)


### Bug Fixes

* **adapter-xhr:** Only modify the `responseType` if it was changed ([#363](https://github.com/netflix/pollyjs/issues/363)) ([cff4e2d](https://github.com/netflix/pollyjs/commit/cff4e2d))





# [5.0.0](https://github.com/netflix/pollyjs/compare/v4.3.0...v5.0.0) (2020-06-23)


### Bug Fixes

* **adapter-fetch:** Add statusText to the response ([#341](https://github.com/netflix/pollyjs/issues/341)) ([0d45953](https://github.com/netflix/pollyjs/commit/0d45953))
* **core:** Compute order based on id and recording name ([#342](https://github.com/netflix/pollyjs/issues/342)) ([42004d2](https://github.com/netflix/pollyjs/commit/42004d2))


### Features

* Remove deprecated Persister.name and Adapter.name ([#343](https://github.com/netflix/pollyjs/issues/343)) ([1223ba0](https://github.com/netflix/pollyjs/commit/1223ba0))


### BREAKING CHANGES

* Persister.name and Adapter.name have been replaced with Persister.id and Adapter.id
* **core:** A request's order is will now be computed based on its id and the recording name it will be persisted to.





# [4.3.0](https://github.com/netflix/pollyjs/compare/v4.2.1...v4.3.0) (2020-05-18)


### Features

* **adapter-fetch:** Add support for handling binary data ([#332](https://github.com/netflix/pollyjs/issues/332)) ([111bebf](https://github.com/netflix/pollyjs/commit/111bebf))
* **adapter-xhr:** Add support for handling binary data ([#333](https://github.com/netflix/pollyjs/issues/333)) ([48ea1d7](https://github.com/netflix/pollyjs/commit/48ea1d7))
* **core:** Add `flushRequestsOnStop` configuration option ([#335](https://github.com/netflix/pollyjs/issues/335)) ([ab4a2e1](https://github.com/netflix/pollyjs/commit/ab4a2e1))





## [4.2.1](https://github.com/netflix/pollyjs/compare/v4.2.0...v4.2.1) (2020-04-30)


### Bug Fixes

* **adapter-node-http:** Improve binary response body handling ([#329](https://github.com/netflix/pollyjs/issues/329)) ([9466989](https://github.com/netflix/pollyjs/commit/9466989))





# [4.2.0](https://github.com/netflix/pollyjs/compare/v4.1.0...v4.2.0) (2020-04-29)


### Features

* **node-server:** Pass options to the CORS middleware via `corsOptions` ([3d991f5](https://github.com/netflix/pollyjs/commit/3d991f5))





# [4.1.0](https://github.com/netflix/pollyjs/compare/v4.0.4...v4.1.0) (2020-04-23)


### Bug Fixes

* Improve abort handling ([#320](https://github.com/netflix/pollyjs/issues/320)) ([cc46bb4](https://github.com/netflix/pollyjs/commit/cc46bb4))
* Legacy persisters and adapters should register ([#325](https://github.com/netflix/pollyjs/issues/325)) ([8fd4d19](https://github.com/netflix/pollyjs/commit/8fd4d19))


### Features

* **persister:** Add `disableSortingHarEntries` option ([#321](https://github.com/netflix/pollyjs/issues/321)) ([0003c0e](https://github.com/netflix/pollyjs/commit/0003c0e))





## [4.0.4](https://github.com/netflix/pollyjs/compare/v4.0.3...v4.0.4) (2020-03-21)


### Bug Fixes

* Deprecates adapter & persister `name` in favor of `id` ([#310](https://github.com/netflix/pollyjs/issues/310)) ([41dd093](https://github.com/netflix/pollyjs/commit/41dd093))
* **adapter-node-http:** Bump nock version ([#319](https://github.com/netflix/pollyjs/issues/319)) ([7d361a6](https://github.com/netflix/pollyjs/commit/7d361a6))





## [4.0.3](https://github.com/netflix/pollyjs/compare/v4.0.2...v4.0.3) (2020-01-30)


### Bug Fixes

* **adapter-node-http:** Use requestBodyBuffers to parse body ([#304](https://github.com/netflix/pollyjs/issues/304)) ([113fec5](https://github.com/netflix/pollyjs/commit/113fec5))





## [4.0.2](https://github.com/netflix/pollyjs/compare/v4.0.1...v4.0.2) (2020-01-29)


### Bug Fixes

* **core:** Strict null query param handling ([#302](https://github.com/netflix/pollyjs/issues/302)) ([5cf70aa](https://github.com/netflix/pollyjs/commit/5cf70aa))





## [4.0.1](https://github.com/netflix/pollyjs/compare/v4.0.0...v4.0.1) (2020-01-25)


### Bug Fixes

* **ember:** Config read from project root ([7d6da38](https://github.com/netflix/pollyjs/commit/7d6da38))





# [4.0.0](https://github.com/netflix/pollyjs/compare/v3.0.2...v4.0.0) (2020-01-13)


### Bug Fixes

* **adapter:** Clone the recording entry before mutating it ([#294](https://github.com/netflix/pollyjs/issues/294)) ([d7e1303](https://github.com/netflix/pollyjs/commit/d7e1303))
* **core:** Disconnect from all adapters when `pause` is called ([#291](https://github.com/netflix/pollyjs/issues/291)) ([5c655bf](https://github.com/netflix/pollyjs/commit/5c655bf))


### chore

* Drop node 8 support ([#292](https://github.com/netflix/pollyjs/issues/292)) ([4448be5](https://github.com/netflix/pollyjs/commit/4448be5))


### Features

* **core:** Provide the request as an argument to matchRequestsBy methods ([#293](https://github.com/netflix/pollyjs/issues/293)) ([4e3163f](https://github.com/netflix/pollyjs/commit/4e3163f))
* **core:** Remove deprecated `recordIfExpired` option ([#295](https://github.com/netflix/pollyjs/issues/295)) ([5fe991d](https://github.com/netflix/pollyjs/commit/5fe991d))


### BREAKING CHANGES

* **core:** `recordIfExpired` is no longer supported, please use `expiryStrategy` instead.
* Drop support for Node 8 as it is now EOL
* **core:** Calling `polly.pause()` will now disconnect from all connected adapters instead of setting the mode to passthrough. Calling `polly.play()` will reconnect to the disconnected adapters before pause was called.





## [3.0.2](https://github.com/netflix/pollyjs/compare/v3.0.1...v3.0.2) (2020-01-08)


### Bug Fixes

* **adapter-node-http:** Bump nock version to correctly handle re… ([#289](https://github.com/netflix/pollyjs/issues/289)) ([8d0ae97](https://github.com/netflix/pollyjs/commit/8d0ae97)), closes [#278](https://github.com/netflix/pollyjs/issues/278)





## [3.0.1](https://github.com/netflix/pollyjs/compare/v3.0.0...v3.0.1) (2019-12-25)


### Bug Fixes

* **adapter-fetch:** Fix "failed to construct Request" issue ([#287](https://github.com/netflix/pollyjs/issues/287)) ([d17ab9b](https://github.com/netflix/pollyjs/commit/d17ab9b)), closes [#286](https://github.com/netflix/pollyjs/issues/286)





# [3.0.0](https://github.com/netflix/pollyjs/compare/v2.7.0...v3.0.0) (2019-12-18)


### Bug Fixes

* **ember:** loads polly config for ember by its own module ([#277](https://github.com/netflix/pollyjs/issues/277)) ([0569040](https://github.com/netflix/pollyjs/commit/0569040))


### BREAKING CHANGES

* **ember:** moves location of polly configuration





# [2.7.0](https://github.com/netflix/pollyjs/compare/v2.6.3...v2.7.0) (2019-11-21)


### Bug Fixes

* **adapter-node-http:** Correctly handle uploading binary data ([#257](https://github.com/netflix/pollyjs/issues/257)) ([31f0e0a](https://github.com/netflix/pollyjs/commit/31f0e0a))


### Features

* **adapter-node-http:** Upgrade nock to v11.x ([#273](https://github.com/netflix/pollyjs/issues/273)) ([5d42cbd](https://github.com/netflix/pollyjs/commit/5d42cbd))





## [2.6.3](https://github.com/netflix/pollyjs/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/commit/5b4edf3))
* **adapter-fetch:** Correctly handle Request instance passed into fetch ([#259](https://github.com/netflix/pollyjs/issues/259)) ([593ecb9](https://github.com/netflix/pollyjs/commit/593ecb9))





## [2.6.2](https://github.com/netflix/pollyjs/compare/v2.6.1...v2.6.2) (2019-08-05)


### Bug Fixes

* Bowser.getParser empty string UserAgent error ([#246](https://github.com/netflix/pollyjs/issues/246)) ([2c9c4b9](https://github.com/netflix/pollyjs/commit/2c9c4b9))


### Features

* Adds an in-memory persister to test polly internals ([#237](https://github.com/netflix/pollyjs/issues/237)) ([5a6fda6](https://github.com/netflix/pollyjs/commit/5a6fda6))





## [2.6.1](https://github.com/netflix/pollyjs/compare/v2.6.0...v2.6.1) (2019-08-01)


### Bug Fixes

* **persister:** Default to empty string if userAgent is empty ([#242](https://github.com/netflix/pollyjs/issues/242)) ([c46d65c](https://github.com/netflix/pollyjs/commit/c46d65c))





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
