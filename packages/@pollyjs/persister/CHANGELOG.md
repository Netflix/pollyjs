# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

* **types:** add types.d.ts to package.files ([#431](https://github.com/netflix/pollyjs/issues/431)) ([113ee89](https://github.com/netflix/pollyjs/commit/113ee898bcf0467c5c48c15b53fc9198e2e91cb1))





# [6.0.0](https://github.com/netflix/pollyjs/compare/v5.2.0...v6.0.0) (2021-11-30)


### Bug Fixes

* **persister:** Only treat status codes >= 400 as failed ([#430](https://github.com/netflix/pollyjs/issues/430)) ([7658952](https://github.com/netflix/pollyjs/commit/765895232746cd560da6bd566de8a312045b1703))


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





## [5.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v5.1.0...v5.1.1) (2021-06-02)

**Note:** Version bump only for package @pollyjs/persister





# [5.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v4.3.0...v5.0.0) (2020-06-23)


### Features

* Remove deprecated Persister.name and Adapter.name ([#343](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/343)) ([1223ba0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/1223ba0))


### BREAKING CHANGES

* Persister.name and Adapter.name have been replaced with Persister.id and Adapter.id





# [4.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v4.2.1...v4.3.0) (2020-05-18)

**Note:** Version bump only for package @pollyjs/persister





## [4.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v4.2.0...v4.2.1) (2020-04-30)


### Bug Fixes

* **adapter-node-http:** Improve binary response body handling ([#329](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/329)) ([9466989](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/9466989))





# [4.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v4.0.4...v4.1.0) (2020-04-23)


### Bug Fixes

* Legacy persisters and adapters should register ([#325](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/325)) ([8fd4d19](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/8fd4d19))


### Features

* **persister:** Add `disableSortingHarEntries` option ([#321](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/321)) ([0003c0e](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0003c0e))





## [4.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v4.0.3...v4.0.4) (2020-03-21)


### Bug Fixes

* Deprecates adapter & persister `name` in favor of `id` ([#310](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/310)) ([41dd093](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/41dd093))





## [4.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v4.0.1...v4.0.2) (2020-01-29)

**Note:** Version bump only for package @pollyjs/persister





# [4.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v3.0.2...v4.0.0) (2020-01-13)

**Note:** Version bump only for package @pollyjs/persister





# [3.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v2.7.0...v3.0.0) (2019-12-18)

**Note:** Version bump only for package @pollyjs/persister





## [2.6.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/5b4edf3))





## [2.6.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v2.6.1...v2.6.2) (2019-08-05)


### Bug Fixes

* Bowser.getParser empty string UserAgent error ([#246](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/246)) ([2c9c4b9](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/2c9c4b9))





## [2.6.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v2.6.0...v2.6.1) (2019-08-01)


### Bug Fixes

* **persister:** Default to empty string if userAgent is empty ([#242](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/issues/242)) ([c46d65c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/c46d65c))





# [2.6.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v2.5.0...v2.6.0) (2019-07-17)

**Note:** Version bump only for package @pollyjs/persister





# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v2.0.0...v2.1.0) (2019-02-04)


### Bug Fixes

* Correctly handle array header values ([#179](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/179)) ([fb7dbb4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/fb7dbb4))





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v1.4.2...v2.0.0) (2019-01-29)


### Bug Fixes

* **persister:** Only persist post data if a request has a body ([#171](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/171)) ([f62d318](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/f62d318))


### Features

* Make PollyRequest.respond accept a response object ([#168](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/168)) ([5b07b26](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/5b07b26))


### BREAKING CHANGES

* Any adapters calling `pollyRequest.respond` should pass it a response object instead of the previous 3 arguments (statusCode, headers, body).





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/persister





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/persister





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/v1.2.0...v1.3.1) (2018-11-28)

**Note:** Version bump only for package @pollyjs/persister





<a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* Creator cleanup and persister assertion ([#67](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/67)) ([19fee5a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/19fee5a))
* **persister:** Handle concurrent find requests ([#88](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/88)) ([0e02414](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0e02414))


### Features

* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0a3d591))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/e622640))
* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/8bb313c))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/29ed8e1))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0a0eeca))
* **core:** Server level configuration ([#80](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/80)) ([0f32d9b](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0f32d9b))
* **persister:** Add `keepUnusedRequests` config option ([#108](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/108)) ([3f5f5b2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/3f5f5b2))
* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/a04d7a7))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="1.0.4"></a>
## [1.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/@pollyjs/persister@1.0.3...@pollyjs/persister@1.0.4) (2018-08-22)




**Note:** Version bump only for package @pollyjs/persister

<a name="1.0.3"></a>
## [1.0.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/@pollyjs/persister@1.0.2...@pollyjs/persister@1.0.3) (2018-08-12)




**Note:** Version bump only for package @pollyjs/persister

<a name="1.0.2"></a>
## [1.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/@pollyjs/persister@1.0.1...@pollyjs/persister@1.0.2) (2018-08-12)




**Note:** Version bump only for package @pollyjs/persister

<a name="1.0.1"></a>
## [1.0.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/@pollyjs/persister@1.0.0...@pollyjs/persister@1.0.1) (2018-08-09)


### Bug Fixes

* **persister:** Handle concurrent find requests ([#88](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/88)) ([0e02414](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0e02414))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/@pollyjs/persister@0.2.1...@pollyjs/persister@1.0.0) (2018-07-20)


### Bug Fixes

* Creator cleanup and persister assertion ([#67](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/67)) ([19fee5a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/19fee5a))


### Features

* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0a3d591))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/e622640))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/29ed8e1))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/0a0eeca))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="0.2.1"></a>
## [0.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/@pollyjs/persister@0.2.0...@pollyjs/persister@0.2.1) (2018-06-27)




**Note:** Version bump only for package @pollyjs/persister

<a name="0.2.0"></a>
# [0.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/compare/@pollyjs/persister@0.1.0...@pollyjs/persister@0.2.0) (2018-06-21)


### Features

* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/persister/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/a04d7a7))




<a name="0.1.0"></a>
# 0.1.0 (2018-06-16)


### Features

* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister/commit/8bb313c))
