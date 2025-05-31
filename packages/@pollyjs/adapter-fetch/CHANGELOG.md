# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.7](https://github.com/netflix/pollyjs/compare/v6.0.6...v6.0.7) (2025-05-31)


### Bug Fixes

* Undeprecating fetch for node because node supports fetch now ([#506](https://github.com/netflix/pollyjs/issues/506)) ([be0bd6c](https://github.com/netflix/pollyjs/commit/be0bd6ca0035565a1c29770bfc87f0b0754fec27))





## [6.0.6](https://github.com/netflix/pollyjs/compare/v6.0.5...v6.0.6) (2023-07-20)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [6.0.5](https://github.com/netflix/pollyjs/compare/v6.0.4...v6.0.5) (2022-04-04)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [6.0.4](https://github.com/netflix/pollyjs/compare/v6.0.3...v6.0.4) (2021-12-10)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [6.0.3](https://github.com/netflix/pollyjs/compare/v6.0.2...v6.0.3) (2021-12-08)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [6.0.2](https://github.com/netflix/pollyjs/compare/v6.0.1...v6.0.2) (2021-12-07)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [6.0.1](https://github.com/netflix/pollyjs/compare/v6.0.0...v6.0.1) (2021-12-06)


### Bug Fixes

* **types:** add types.d.ts to package.files ([#431](https://github.com/netflix/pollyjs/issues/431)) ([113ee89](https://github.com/netflix/pollyjs/commit/113ee898bcf0467c5c48c15b53fc9198e2e91cb1))





# [6.0.0](https://github.com/netflix/pollyjs/compare/v5.2.0...v6.0.0) (2021-11-30)


* feat!: Cleanup adapter and persister APIs (#429) ([06499fc](https://github.com/netflix/pollyjs/commit/06499fc2d85254b3329db2bec770d173ed32bca0)), closes [#429](https://github.com/netflix/pollyjs/issues/429)
* feat!: Improve logging and add logLevel (#427) ([bef3ee3](https://github.com/netflix/pollyjs/commit/bef3ee39f71dfc2fa4dbeb522dfba16d01243e9f)), closes [#427](https://github.com/netflix/pollyjs/issues/427)
* chore!: Upgrade package dependencies (#421) ([dd23334](https://github.com/netflix/pollyjs/commit/dd23334fa9b64248e4c49c3616237bdc2f12f682)), closes [#421](https://github.com/netflix/pollyjs/issues/421)
* feat!: Use base64 instead of hex encoding for binary data (#420) ([6bb9b36](https://github.com/netflix/pollyjs/commit/6bb9b36522d73f9c079735d9006a12376aee39ea)), closes [#420](https://github.com/netflix/pollyjs/issues/420)
* feat(ember)!: Upgrade to ember octane (#415) ([8559ef8](https://github.com/netflix/pollyjs/commit/8559ef8c600aefaec629870eac5f5c8953e18b16)), closes [#415](https://github.com/netflix/pollyjs/issues/415)


### BREAKING CHANGES

* - Adapter
	- `passthroughRequest` renamed to `onFetchResponse`
	- `respondToRequest` renamed to `onRespond`

- Persister
	- `findRecording` renamed to `onFindRecording`
	- `saveRecording` renamed to `onSaveRecording`
	- `deleteRecording` renamed to `onDeleteRecording`
* The `logging` configuration option has now been replaced with `logLevel`. This allows for more fine-grain control over what should be logged as well as silencing logs altogether. 
* Recording file name will no longer have trailing dashes
* Use the standard `encoding` field on the generated har file instead of `_isBinary` and use `base64` encoding instead of `hex` to reduce the payload size.
* @pollyjs dependencies have been moved to peer dependencies





## [5.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v5.1.0...v5.1.1) (2021-06-02)


### Bug Fixes

* Handle failed arraybuffer instanceof checks ([#393](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/393)) ([247be0a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/247be0a))





# [5.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v5.0.2...v5.1.0) (2020-12-12)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [5.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v4.3.0...v5.0.0) (2020-06-23)


### Bug Fixes

* **adapter-fetch:** Add statusText to the response ([#341](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/341)) ([0d45953](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/0d45953))





# [4.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v4.2.1...v4.3.0) (2020-05-18)


### Features

* **adapter-fetch:** Add support for handling binary data ([#332](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/332)) ([111bebf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/111bebf))
* **adapter-xhr:** Add support for handling binary data ([#333](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/333)) ([48ea1d7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/48ea1d7))





## [4.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v4.2.0...v4.2.1) (2020-04-30)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [4.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v4.0.4...v4.1.0) (2020-04-23)


### Bug Fixes

* Improve abort handling ([#320](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/320)) ([cc46bb4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/cc46bb4))





## [4.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v4.0.3...v4.0.4) (2020-03-21)


### Bug Fixes

* Deprecates adapter & persister `name` in favor of `id` ([#310](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/310)) ([41dd093](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/41dd093))





## [4.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v4.0.1...v4.0.2) (2020-01-29)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [4.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v3.0.2...v4.0.0) (2020-01-13)


### Bug Fixes

* **core:** Disconnect from all adapters when `pause` is called ([#291](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/291)) ([5c655bf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/5c655bf))


### BREAKING CHANGES

* **core:** Calling `polly.pause()` will now disconnect from all connected adapters instead of setting the mode to passthrough. Calling `polly.play()` will reconnect to the disconnected adapters before pause was called.





## [3.0.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v3.0.0...v3.0.1) (2019-12-25)


### Bug Fixes

* **adapter-fetch:** Fix "failed to construct Request" issue ([#287](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/287)) ([d17ab9b](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/d17ab9b)), closes [#286](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/286)





# [3.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.7.0...v3.0.0) (2019-12-18)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [2.6.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/5b4edf3))
* **adapter-fetch:** Correctly handle Request instance passed into fetch ([#259](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/259)) ([593ecb9](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/593ecb9))





## [2.6.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.6.1...v2.6.2) (2019-08-05)


### Features

* Adds an in-memory persister to test polly internals ([#237](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/237)) ([5a6fda6](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/5a6fda6))





## [2.6.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.6.0...v2.6.1) (2019-08-01)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [2.6.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.5.0...v2.6.0) (2019-07-17)


### Bug Fixes

* **adapter-fetch:** Handle `Request` objects as URLs ([#220](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/220)) ([bb28d54](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/bb28d54))


### Features

* PollyError and improved adapter error handling ([#234](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/issues/234)) ([23a2127](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/23a2127))





# [2.5.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.4.0...v2.5.0) (2019-06-06)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [2.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.3.2...v2.4.0) (2019-04-27)


### Features

* **core:** Improved control flow with `times` and `stopPropagation` ([#202](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/202)) ([2c8231e](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/2c8231e))





## [2.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.3.0...v2.3.1) (2019-03-06)


### Bug Fixes

* **adapter-fetch:** Correctly handle key/value pairs headers ([dc0323d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/dc0323d))





# [2.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.2.0...v2.3.0) (2019-02-27)


### Features

* **core:** Filter requests matched by a route handler ([#189](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/189)) ([5d57c32](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/5d57c32))





# [2.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.1.0...v2.2.0) (2019-02-20)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v2.0.0...v2.1.0) (2019-02-04)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v1.4.2...v2.0.0) (2019-01-29)


### Features

* Simplify adapter implementation ([#154](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/154)) ([12c8601](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/12c8601))


### BREAKING CHANGES

* Changes to the base adapter implementation and external facing API





## [1.4.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v1.4.1...v1.4.2) (2019-01-16)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/adapter-fetch





# [1.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v1.3.2...v1.4.0) (2018-12-07)


### Bug Fixes

* **adapter-fetch:** Deprecate usage in Node in favor of node-http ([#146](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/146)) ([001ccdd](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/001ccdd))





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/adapter-fetch





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/v1.2.0...v1.3.1) (2018-11-28)


### Bug Fixes

* Support URL objects ([#139](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/139)) ([cf0d755](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/cf0d755))
* **core:** Ignore `context` options from being deep merged ([#144](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/144)) ([2123d83](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/2123d83))


### Features

* Add an onIdentifyRequest hook to allow adapter level serialization ([#140](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/140)) ([548002c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/548002c))





<a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* Allow 204 responses without a body ([#101](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/101)) ([20b4125](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/20b4125))
* Loosen up global XHR native check ([#69](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/69)) ([79cdd96](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/79cdd96))


### Features

* Fetch adapter support for `context` provided via adapterOptions ([#66](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/66)) ([82ebd09](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/82ebd09))




<a name="1.0.5"></a>
## [1.0.5](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/@pollyjs/adapter-fetch@1.0.4...@pollyjs/adapter-fetch@1.0.5) (2018-08-22)


### Bug Fixes

* Allow 204 responses without a body ([#101](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/101)) ([20b4125](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/20b4125))




<a name="1.0.4"></a>
## [1.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/@pollyjs/adapter-fetch@1.0.3...@pollyjs/adapter-fetch@1.0.4) (2018-08-12)




**Note:** Version bump only for package @pollyjs/adapter-fetch

<a name="1.0.3"></a>
## [1.0.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/@pollyjs/adapter-fetch@1.0.2...@pollyjs/adapter-fetch@1.0.3) (2018-08-12)




**Note:** Version bump only for package @pollyjs/adapter-fetch

<a name="1.0.2"></a>
## [1.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/@pollyjs/adapter-fetch@1.0.1...@pollyjs/adapter-fetch@1.0.2) (2018-08-09)




**Note:** Version bump only for package @pollyjs/adapter-fetch

<a name="1.0.1"></a>
## [1.0.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/compare/@pollyjs/adapter-fetch@1.0.0...@pollyjs/adapter-fetch@1.0.1) (2018-07-26)




**Note:** Version bump only for package @pollyjs/adapter-fetch

<a name="1.0.0"></a>
# 1.0.0 (2018-07-20)


### Bug Fixes

* Loosen up global XHR native check ([#69](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/69)) ([79cdd96](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/79cdd96))


### Features

* Fetch adapter support for `context` provided via adapterOptions ([#66](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-fetch/issues/66)) ([82ebd09](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-fetch/commit/82ebd09))
