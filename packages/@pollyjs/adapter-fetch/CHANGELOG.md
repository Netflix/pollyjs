# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
