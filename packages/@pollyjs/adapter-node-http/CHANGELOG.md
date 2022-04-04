# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.5](https://github.com/netflix/pollyjs/compare/v6.0.4...v6.0.5) (2022-04-04)

**Note:** Version bump only for package @pollyjs/adapter-node-http





## [6.0.4](https://github.com/netflix/pollyjs/compare/v6.0.3...v6.0.4) (2021-12-10)

**Note:** Version bump only for package @pollyjs/adapter-node-http





## [6.0.3](https://github.com/netflix/pollyjs/compare/v6.0.2...v6.0.3) (2021-12-08)

**Note:** Version bump only for package @pollyjs/adapter-node-http





## [6.0.2](https://github.com/netflix/pollyjs/compare/v6.0.1...v6.0.2) (2021-12-07)

**Note:** Version bump only for package @pollyjs/adapter-node-http





## [6.0.1](https://github.com/netflix/pollyjs/compare/v6.0.0...v6.0.1) (2021-12-06)


### Bug Fixes

* **types:** add types.d.ts to package.files ([#431](https://github.com/netflix/pollyjs/issues/431)) ([113ee89](https://github.com/netflix/pollyjs/commit/113ee898bcf0467c5c48c15b53fc9198e2e91cb1))





# [6.0.0](https://github.com/netflix/pollyjs/compare/v5.2.0...v6.0.0) (2021-11-30)


* feat!: Cleanup adapter and persister APIs (#429) ([06499fc](https://github.com/netflix/pollyjs/commit/06499fc2d85254b3329db2bec770d173ed32bca0)), closes [#429](https://github.com/netflix/pollyjs/issues/429)
* chore!: Upgrade package dependencies (#421) ([dd23334](https://github.com/netflix/pollyjs/commit/dd23334fa9b64248e4c49c3616237bdc2f12f682)), closes [#421](https://github.com/netflix/pollyjs/issues/421)
* feat!: Use base64 instead of hex encoding for binary data (#420) ([6bb9b36](https://github.com/netflix/pollyjs/commit/6bb9b36522d73f9c079735d9006a12376aee39ea)), closes [#420](https://github.com/netflix/pollyjs/issues/420)
* feat(ember)!: Upgrade to ember octane (#415) ([8559ef8](https://github.com/netflix/pollyjs/commit/8559ef8c600aefaec629870eac5f5c8953e18b16)), closes [#415](https://github.com/netflix/pollyjs/issues/415)


### Features

* **adapter-node-http:** Upgrade nock to v13 ([#424](https://github.com/netflix/pollyjs/issues/424)) ([2d5b59e](https://github.com/netflix/pollyjs/commit/2d5b59ee0c33ea53a64321249246fcae0a616a3f))


### BREAKING CHANGES

* - Adapter
	- `passthroughRequest` renamed to `onFetchResponse`
	- `respondToRequest` renamed to `onRespond`

- Persister
	- `findRecording` renamed to `onFindRecording`
	- `saveRecording` renamed to `onSaveRecording`
	- `deleteRecording` renamed to `onDeleteRecording`
* Recording file name will no longer have trailing dashes
* Use the standard `encoding` field on the generated har file instead of `_isBinary` and use `base64` encoding instead of `hex` to reduce the payload size.
* @pollyjs dependencies have been moved to peer dependencies





## [5.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v5.1.0...v5.1.1) (2021-06-02)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [5.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v5.0.2...v5.1.0) (2020-12-12)

**Note:** Version bump only for package @pollyjs/adapter-node-http





## [5.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v5.0.1...v5.0.2) (2020-12-06)


### Bug Fixes

* **adapter-node-http:** Remove module monkey patching on disconnect ([#369](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/369)) ([0cec43a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/0cec43a))





# [5.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.3.0...v5.0.0) (2020-06-23)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [4.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.2.1...v4.3.0) (2020-05-18)


### Features

* **adapter-xhr:** Add support for handling binary data ([#333](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/333)) ([48ea1d7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/48ea1d7))





## [4.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.2.0...v4.2.1) (2020-04-30)


### Bug Fixes

* **adapter-node-http:** Improve binary response body handling ([#329](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/329)) ([9466989](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/9466989))





# [4.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.1.0...v4.2.0) (2020-04-29)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [4.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.0.4...v4.1.0) (2020-04-23)


### Bug Fixes

* Improve abort handling ([#320](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/320)) ([cc46bb4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/cc46bb4))





## [4.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.0.3...v4.0.4) (2020-03-21)


### Bug Fixes

* Deprecates adapter & persister `name` in favor of `id` ([#310](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/310)) ([41dd093](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/41dd093))
* **adapter-node-http:** Bump nock version ([#319](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/319)) ([7d361a6](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/7d361a6))





## [4.0.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.0.2...v4.0.3) (2020-01-30)


### Bug Fixes

* **adapter-node-http:** Use requestBodyBuffers to parse body ([#304](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/304)) ([113fec5](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/113fec5))





## [4.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v4.0.1...v4.0.2) (2020-01-29)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [4.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v3.0.2...v4.0.0) (2020-01-13)

**Note:** Version bump only for package @pollyjs/adapter-node-http





## [3.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v3.0.1...v3.0.2) (2020-01-08)


### Bug Fixes

* **adapter-node-http:** Bump nock version to correctly handle re… ([#289](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/289)) ([8d0ae97](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/8d0ae97)), closes [#278](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/278)





# [3.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.7.0...v3.0.0) (2019-12-18)

**Note:** Version bump only for package @pollyjs/adapter-node-http





# [2.7.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.6.3...v2.7.0) (2019-11-21)


### Bug Fixes

* **adapter-node-http:** Correctly handle uploading binary data ([#257](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/257)) ([31f0e0a](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/31f0e0a))


### Features

* **adapter-node-http:** Upgrade nock to v11.x ([#273](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/273)) ([5d42cbd](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/5d42cbd))





## [2.6.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/5b4edf3))





## [2.6.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/compare/v2.6.1...v2.6.2) (2019-08-05)


### Features

* Adds an in-memory persister to test polly internals ([#237](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/issues/237)) ([5a6fda6](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/adapter-node-http/commit/5a6fda6))





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
