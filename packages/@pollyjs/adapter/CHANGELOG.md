# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/v2.0.0...v2.1.0) (2019-02-04)


### Bug Fixes

* **adapter:** Log information if request couldn't be found in recording ([#172](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/172)) ([8dcdf7b](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/8dcdf7b))
* Correctly handle array header values ([#179](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/179)) ([fb7dbb4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/fb7dbb4))





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/v1.4.2...v2.0.0) (2019-01-29)


### Bug Fixes

* **adapter:** Test for navigator before accessing ([#165](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/165)) ([7200255](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/7200255))


### Features

* Make PollyRequest.respond accept a response object ([#168](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/168)) ([5b07b26](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/5b07b26))
* Simplify adapter implementation ([#154](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/154)) ([12c8601](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/12c8601))


### BREAKING CHANGES

* Any adapters calling `pollyRequest.respond` should pass it a response object instead of the previous 3 arguments (statusCode, headers, body).
* Changes to the base adapter implementation and external facing API





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/adapter





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/adapter





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/v1.2.0...v1.3.1) (2018-11-28)


### Features

* Add an onIdentifyRequest hook to allow adapter level serialization ([#140](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/140)) ([548002c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/548002c))





<a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* Config expiresIn can contain periods. i.e, 1.5 weeks ([e9c7aaa](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/e9c7aaa))
* Creator cleanup and persister assertion ([#67](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/67)) ([19fee5a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/19fee5a))


### Features

* Abort and passthrough from an intercept ([#57](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/57)) ([4ebacb8](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/4ebacb8))
* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/0a3d591))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/e622640))
* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/8bb313c))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/29ed8e1))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/0a0eeca))
* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/f902c6d))
* Wait for all handled requests to resolve via `.flush()` ([#75](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/75)) ([a3113b7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/a3113b7))
* **core:** Server level configuration ([#80](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/80)) ([0f32d9b](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/0f32d9b))
* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/a04d7a7))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="1.1.3"></a>
## [1.1.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@1.1.2...@pollyjs/adapter@1.1.3) (2018-08-22)




**Note:** Version bump only for package @pollyjs/adapter

<a name="1.1.2"></a>
## [1.1.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@1.1.1...@pollyjs/adapter@1.1.2) (2018-08-12)




**Note:** Version bump only for package @pollyjs/adapter

<a name="1.1.1"></a>
## [1.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@1.1.0...@pollyjs/adapter@1.1.1) (2018-08-12)




**Note:** Version bump only for package @pollyjs/adapter

<a name="1.1.0"></a>
# [1.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@1.0.0...@pollyjs/adapter@1.1.0) (2018-07-26)


### Features

* Wait for all handled requests to resolve via `.flush()` ([#75](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/75)) ([a3113b7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/a3113b7))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@0.3.1...@pollyjs/adapter@1.0.0) (2018-07-20)


### Bug Fixes

* Creator cleanup and persister assertion ([#67](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/67)) ([19fee5a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/19fee5a))


### Features

* Abort and passthrough from an intercept ([#57](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/57)) ([4ebacb8](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/4ebacb8))
* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/0a3d591))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/e622640))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/29ed8e1))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/0a0eeca))
* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/f902c6d))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="0.3.1"></a>
## [0.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@0.3.0...@pollyjs/adapter@0.3.1) (2018-06-27)




**Note:** Version bump only for package @pollyjs/adapter

<a name="0.3.0"></a>
# [0.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@0.2.0...@pollyjs/adapter@0.3.0) (2018-06-21)


### Features

* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/a04d7a7))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/compare/@pollyjs/adapter@0.1.0...@pollyjs/adapter@0.2.0) (2018-06-16)


### Features

* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter/commit/8bb313c))
