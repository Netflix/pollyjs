# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v4.2.1...v4.3.0) (2020-05-18)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





## [4.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v4.2.0...v4.2.1) (2020-04-30)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





# [4.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v4.1.0...v4.2.0) (2020-04-29)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





# [4.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v4.0.4...v4.1.0) (2020-04-23)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





## [4.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v4.0.3...v4.0.4) (2020-03-21)


### Bug Fixes

* Deprecates adapter & persister `name` in favor of `id` ([#310](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/issues/310)) ([41dd093](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/41dd093))





## [4.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v4.0.1...v4.0.2) (2020-01-29)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





# [4.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v3.0.2...v4.0.0) (2020-01-13)


### Bug Fixes

* **core:** Disconnect from all adapters when `pause` is called ([#291](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/issues/291)) ([5c655bf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/5c655bf))


### BREAKING CHANGES

* **core:** Calling `polly.pause()` will now disconnect from all connected adapters instead of setting the mode to passthrough. Calling `polly.play()` will reconnect to the disconnected adapters before pause was called.





# [3.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.7.0...v3.0.0) (2019-12-18)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





## [2.6.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/5b4edf3))





## [2.6.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.6.1...v2.6.2) (2019-08-05)


### Features

* Adds an in-memory persister to test polly internals ([#237](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/issues/237)) ([5a6fda6](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/5a6fda6))





## [2.6.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.6.0...v2.6.1) (2019-08-01)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





# [2.6.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.5.0...v2.6.0) (2019-07-17)


### Features

* PollyError and improved adapter error handling ([#234](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/issues/234)) ([23a2127](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/23a2127))





# [2.5.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.4.0...v2.5.0) (2019-06-06)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





# [2.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.3.2...v2.4.0) (2019-04-27)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





## [2.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.3.1...v2.3.2) (2019-04-09)


### Bug Fixes

* **adapter-puppeteer:** Remove other resource type matching ([#197](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/197)) ([ea6bfcc](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/ea6bfcc))





# [2.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.2.0...v2.3.0) (2019-02-27)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





# [2.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.1.0...v2.2.0) (2019-02-20)


### Features

* Add `error` event and improve error handling ([#185](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/185)) ([3694ebc](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/3694ebc))





# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v2.0.0...v2.1.0) (2019-02-04)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v1.4.2...v2.0.0) (2019-01-29)


### Features

* Simplify adapter implementation ([#154](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/154)) ([12c8601](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/12c8601))


### BREAKING CHANGES

* Changes to the base adapter implementation and external facing API





## [1.4.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v1.4.1...v1.4.2) (2019-01-16)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/v1.2.0...v1.3.1) (2018-11-28)

**Note:** Version bump only for package @pollyjs/adapter-puppeteer





<a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* **adapter-puppeteer:** Do not intercept CORS preflight requests ([#90](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/90)) ([53ad433](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/53ad433))
* Puppeteer 1.7.0 support ([#100](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/100)) ([e208b38](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/e208b38))
* Puppeteer CORS request matching ([#110](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/110)) ([7831115](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/7831115))


### Features

* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/f902c6d))
* Wait for all handled requests to resolve via `.flush()` ([#75](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/75)) ([a3113b7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/a3113b7))




<a name="1.1.4"></a>
## [1.1.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/@pollyjs/adapter-puppeteer@1.1.3...@pollyjs/adapter-puppeteer@1.1.4) (2018-08-22)


### Bug Fixes

* Puppeteer 1.7.0 support ([#100](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/100)) ([e208b38](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/e208b38))




<a name="1.1.3"></a>
## [1.1.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/@pollyjs/adapter-puppeteer@1.1.2...@pollyjs/adapter-puppeteer@1.1.3) (2018-08-12)




**Note:** Version bump only for package @pollyjs/adapter-puppeteer

<a name="1.1.2"></a>
## [1.1.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/@pollyjs/adapter-puppeteer@1.1.1...@pollyjs/adapter-puppeteer@1.1.2) (2018-08-12)


### Bug Fixes

* **adapter-puppeteer:** Do not intercept CORS preflight requests ([#90](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/90)) ([53ad433](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/53ad433))




<a name="1.1.1"></a>
## [1.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/@pollyjs/adapter-puppeteer@1.1.0...@pollyjs/adapter-puppeteer@1.1.1) (2018-08-09)




**Note:** Version bump only for package @pollyjs/adapter-puppeteer

<a name="1.1.0"></a>
# [1.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/compare/@pollyjs/adapter-puppeteer@1.0.0...@pollyjs/adapter-puppeteer@1.1.0) (2018-07-26)


### Features

* Wait for all handled requests to resolve via `.flush()` ([#75](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/75)) ([a3113b7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/a3113b7))




<a name="1.0.0"></a>
# 1.0.0 (2018-07-20)


### Features

* Puppeteer Adapter ([#64](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-puppeteer/issues/64)) ([f902c6d](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-puppeteer/commit/f902c6d))
