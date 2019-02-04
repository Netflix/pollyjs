# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
