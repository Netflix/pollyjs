# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.6.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.6.0...v2.6.1) (2019-08-01)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [2.6.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.5.0...v2.6.0) (2019-07-17)


### Features

* PollyError and improved adapter error handling ([#234](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/234)) ([23a2127](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/23a2127))





# [2.5.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.4.0...v2.5.0) (2019-06-06)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [2.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.3.2...v2.4.0) (2019-04-27)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [2.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.2.0...v2.3.0) (2019-02-27)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [2.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.1.0...v2.2.0) (2019-02-20)


### Features

* Add `error` event and improve error handling ([#185](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-node-http/issues/185)) ([3694ebc](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/3694ebc))





# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.0.0...v2.1.0) (2019-02-04)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v1.4.2...v2.0.0) (2019-01-29)


### Features

* Simplify adapter implementation ([#154](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-node-http/issues/154)) ([12c8601](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/12c8601))


*  feat(adapter-node-http): Use `nock` under the hood instead of custom implementation (#166) ([62374f4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/62374f4)), closes [#166](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/166)


### BREAKING CHANGES

* The node-http adapter no longer accepts the `transports` option
* Changes to the base adapter implementation and external facing API





## [1.4.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v1.4.1...v1.4.2) (2019-01-16)


### Bug Fixes

* **adapter-node-http:** Fix unhandled rejection if connection fails ([#160](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-node-http/issues/160)) ([12fcfa7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/12fcfa7))
* **adapter-node-http:** Pause socket on original request ([#162](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-node-http/issues/162)) ([8f0c56c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/8f0c56c))





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [1.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v1.3.2...v1.4.0) (2018-12-07)


### Features

* Node HTTP Adapter ([#128](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/adapter-node-http/issues/128)) ([fa059a4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/fa059a4))
