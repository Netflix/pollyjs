# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
