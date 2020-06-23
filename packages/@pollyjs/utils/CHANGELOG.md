# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v4.3.0...v5.0.0) (2020-06-23)


### Features

* Remove deprecated Persister.name and Adapter.name ([#343](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/issues/343)) ([1223ba0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/1223ba0))


### BREAKING CHANGES

* Persister.name and Adapter.name have been replaced with Persister.id and Adapter.id





# [4.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v4.2.1...v4.3.0) (2020-05-18)


### Features

* **adapter-xhr:** Add support for handling binary data ([#333](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/issues/333)) ([48ea1d7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/48ea1d7))





# [4.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v4.0.4...v4.1.0) (2020-04-23)


### Bug Fixes

* Legacy persisters and adapters should register ([#325](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/issues/325)) ([8fd4d19](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/8fd4d19))





## [4.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v4.0.1...v4.0.2) (2020-01-29)


### Bug Fixes

* **core:** Strict null query param handling ([#302](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/issues/302)) ([5cf70aa](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/5cf70aa))





# [4.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v3.0.2...v4.0.0) (2020-01-13)

**Note:** Version bump only for package @pollyjs/utils





# [3.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v2.7.0...v3.0.0) (2019-12-18)

**Note:** Version bump only for package @pollyjs/utils





## [2.6.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/5b4edf3))





# [2.6.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v2.5.0...v2.6.0) (2019-07-17)


### Features

* PollyError and improved adapter error handling ([#234](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/issues/234)) ([23a2127](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/23a2127))





# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v2.0.0...v2.1.0) (2019-02-04)

**Note:** Version bump only for package @pollyjs/utils





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v1.4.2...v2.0.0) (2019-01-29)


### Features

* Make PollyRequest.respond accept a response object ([#168](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/168)) ([5b07b26](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/5b07b26))


*  feat(adapter-node-http): Use `nock` under the hood instead of custom implementation (#166) ([62374f4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/62374f4)), closes [#166](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/issues/166)


### BREAKING CHANGES

* The node-http adapter no longer accepts the `transports` option
* Any adapters calling `pollyRequest.respond` should pass it a response object instead of the previous 3 arguments (statusCode, headers, body).





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v1.4.0...v1.4.1) (2018-12-13)


### Bug Fixes

* **utils:** Support arrays & nested objects in query params ([#148](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/148)) ([7e846b0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/7e846b0))





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/utils





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/v1.2.0...v1.3.1) (2018-11-28)


### Features

* **core:** Support custom functions in matchRequestsBy config options ([#138](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/138)) ([626a84c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/626a84c))
* Add an onIdentifyRequest hook to allow adapter level serialization ([#140](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/140)) ([548002c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/548002c))





<a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* **adapter-puppeteer:** Do not intercept CORS preflight requests ([#90](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/90)) ([53ad433](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/53ad433))


### Features

* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/e622640))
* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/8bb313c))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/0a0eeca))
* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/f902c6d))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="1.0.3"></a>
## [1.0.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/@pollyjs/utils@1.0.2...@pollyjs/utils@1.0.3) (2018-08-22)




**Note:** Version bump only for package @pollyjs/utils

<a name="1.0.2"></a>
## [1.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/@pollyjs/utils@1.0.1...@pollyjs/utils@1.0.2) (2018-08-12)




**Note:** Version bump only for package @pollyjs/utils

<a name="1.0.1"></a>
## [1.0.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/@pollyjs/utils@1.0.0...@pollyjs/utils@1.0.1) (2018-08-12)


### Bug Fixes

* **adapter-puppeteer:** Do not intercept CORS preflight requests ([#90](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/90)) ([53ad433](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/53ad433))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/@pollyjs/utils@0.1.1...@pollyjs/utils@1.0.0) (2018-07-20)


### Features

* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/e622640))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/0a0eeca))
* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/utils/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/f902c6d))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="0.1.1"></a>
## [0.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/compare/@pollyjs/utils@0.1.0...@pollyjs/utils@0.1.1) (2018-06-27)




**Note:** Version bump only for package @pollyjs/utils

<a name="0.1.0"></a>
# 0.1.0 (2018-06-16)


### Features

* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/utils/commit/8bb313c))
