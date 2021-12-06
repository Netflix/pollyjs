# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.1](https://github.com/netflix/pollyjs/compare/v6.0.0...v6.0.1) (2021-12-06)


### Bug Fixes

* **types:** add types.d.ts to package.files ([#431](https://github.com/netflix/pollyjs/issues/431)) ([113ee89](https://github.com/netflix/pollyjs/commit/113ee898bcf0467c5c48c15b53fc9198e2e91cb1))





# [6.0.0](https://github.com/netflix/pollyjs/compare/v5.2.0...v6.0.0) (2021-11-30)


* feat!: Cleanup adapter and persister APIs (#429) ([06499fc](https://github.com/netflix/pollyjs/commit/06499fc2d85254b3329db2bec770d173ed32bca0)), closes [#429](https://github.com/netflix/pollyjs/issues/429)
* feat(ember)!: Upgrade to ember octane (#415) ([8559ef8](https://github.com/netflix/pollyjs/commit/8559ef8c600aefaec629870eac5f5c8953e18b16)), closes [#415](https://github.com/netflix/pollyjs/issues/415)


### BREAKING CHANGES

* - Adapter
	- `passthroughRequest` renamed to `onFetchResponse`
	- `respondToRequest` renamed to `onRespond`

- Persister
	- `findRecording` renamed to `onFindRecording`
	- `saveRecording` renamed to `onSaveRecording`
	- `deleteRecording` renamed to `onDeleteRecording`
* @pollyjs dependencies have been moved to peer dependencies





## [5.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v5.1.0...v5.1.1) (2021-06-02)

**Note:** Version bump only for package @pollyjs/persister-rest





# [5.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v4.3.0...v5.0.0) (2020-06-23)

**Note:** Version bump only for package @pollyjs/persister-rest





# [4.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v4.2.1...v4.3.0) (2020-05-18)

**Note:** Version bump only for package @pollyjs/persister-rest





## [4.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v4.2.0...v4.2.1) (2020-04-30)

**Note:** Version bump only for package @pollyjs/persister-rest





# [4.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v4.0.4...v4.1.0) (2020-04-23)

**Note:** Version bump only for package @pollyjs/persister-rest





## [4.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v4.0.3...v4.0.4) (2020-03-21)


### Bug Fixes

* Deprecates adapter & persister `name` in favor of `id` ([#310](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/issues/310)) ([41dd093](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/commit/41dd093))





## [4.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v4.0.1...v4.0.2) (2020-01-29)

**Note:** Version bump only for package @pollyjs/persister-rest





# [4.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v3.0.2...v4.0.0) (2020-01-13)

**Note:** Version bump only for package @pollyjs/persister-rest





# [3.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v2.7.0...v3.0.0) (2019-12-18)

**Note:** Version bump only for package @pollyjs/persister-rest





## [2.6.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/commit/5b4edf3))





## [2.6.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v2.6.1...v2.6.2) (2019-08-05)

**Note:** Version bump only for package @pollyjs/persister-rest





## [2.6.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v2.6.0...v2.6.1) (2019-08-01)

**Note:** Version bump only for package @pollyjs/persister-rest





# [2.6.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v2.5.0...v2.6.0) (2019-07-17)

**Note:** Version bump only for package @pollyjs/persister-rest





# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v2.0.0...v2.1.0) (2019-02-04)

**Note:** Version bump only for package @pollyjs/persister-rest





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v1.4.2...v2.0.0) (2019-01-29)

**Note:** Version bump only for package @pollyjs/persister-rest





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/persister-rest





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/persister-rest





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/v1.2.0...v1.3.1) (2018-11-28)

**Note:** Version bump only for package @pollyjs/persister-rest





<a name="1.2.0"></a>
# 1.2.0 (2018-09-16)




**Note:** Version bump only for package @pollyjs/persister-rest

<a name="1.0.5"></a>
## [1.0.5](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/@pollyjs/persister-rest@1.0.4...@pollyjs/persister-rest@1.0.5) (2018-08-22)




**Note:** Version bump only for package @pollyjs/persister-rest

<a name="1.0.4"></a>
## [1.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/@pollyjs/persister-rest@1.0.3...@pollyjs/persister-rest@1.0.4) (2018-08-12)




**Note:** Version bump only for package @pollyjs/persister-rest

<a name="1.0.3"></a>
## [1.0.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/@pollyjs/persister-rest@1.0.2...@pollyjs/persister-rest@1.0.3) (2018-08-12)




**Note:** Version bump only for package @pollyjs/persister-rest

<a name="1.0.2"></a>
## [1.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/@pollyjs/persister-rest@1.0.1...@pollyjs/persister-rest@1.0.2) (2018-08-09)




**Note:** Version bump only for package @pollyjs/persister-rest

<a name="1.0.1"></a>
## [1.0.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-rest/compare/@pollyjs/persister-rest@1.0.0...@pollyjs/persister-rest@1.0.1) (2018-07-26)




**Note:** Version bump only for package @pollyjs/persister-rest

<a name="1.0.0"></a>
# 1.0.0 (2018-07-20)




**Note:** Version bump only for package @pollyjs/persister-rest
