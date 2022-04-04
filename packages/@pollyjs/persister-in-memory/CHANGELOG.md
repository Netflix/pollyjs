# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.5](https://github.com/netflix/pollyjs/compare/v6.0.4...v6.0.5) (2022-04-04)

**Note:** Version bump only for package @pollyjs/persister-in-memory





## [6.0.4](https://github.com/netflix/pollyjs/compare/v6.0.3...v6.0.4) (2021-12-10)

**Note:** Version bump only for package @pollyjs/persister-in-memory





## [6.0.3](https://github.com/netflix/pollyjs/compare/v6.0.2...v6.0.3) (2021-12-08)

**Note:** Version bump only for package @pollyjs/persister-in-memory





## [6.0.2](https://github.com/netflix/pollyjs/compare/v6.0.1...v6.0.2) (2021-12-07)

**Note:** Version bump only for package @pollyjs/persister-in-memory





## [6.0.1](https://github.com/netflix/pollyjs/compare/v6.0.0...v6.0.1) (2021-12-06)


### Bug Fixes

* **types:** add types.d.ts to package.files ([#431](https://github.com/netflix/pollyjs/issues/431)) ([113ee89](https://github.com/netflix/pollyjs/commit/113ee898bcf0467c5c48c15b53fc9198e2e91cb1))





# [6.0.0](https://github.com/netflix/pollyjs/compare/v5.2.0...v6.0.0) (2021-11-30)


* feat!: Cleanup adapter and persister APIs (#429) ([06499fc](https://github.com/netflix/pollyjs/commit/06499fc2d85254b3329db2bec770d173ed32bca0)), closes [#429](https://github.com/netflix/pollyjs/issues/429)


### BREAKING CHANGES

* - Adapter
	- `passthroughRequest` renamed to `onFetchResponse`
	- `respondToRequest` renamed to `onRespond`

- Persister
	- `findRecording` renamed to `onFindRecording`
	- `saveRecording` renamed to `onSaveRecording`
	- `deleteRecording` renamed to `onDeleteRecording`





## [5.1.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v5.1.0...v5.1.1) (2021-06-02)

**Note:** Version bump only for package @pollyjs/persister-in-memory





# [5.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v4.3.0...v5.0.0) (2020-06-23)

**Note:** Version bump only for package @pollyjs/persister-in-memory





# [4.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v4.2.1...v4.3.0) (2020-05-18)

**Note:** Version bump only for package @pollyjs/persister-in-memory





## [4.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v4.2.0...v4.2.1) (2020-04-30)

**Note:** Version bump only for package @pollyjs/persister-in-memory





# [4.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v4.0.4...v4.1.0) (2020-04-23)

**Note:** Version bump only for package @pollyjs/persister-in-memory





## [4.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v4.0.3...v4.0.4) (2020-03-21)


### Bug Fixes

* Deprecates adapter & persister `name` in favor of `id` ([#310](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/issues/310)) ([41dd093](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/commit/41dd093))





## [4.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v4.0.1...v4.0.2) (2020-01-29)

**Note:** Version bump only for package @pollyjs/persister-in-memory





# [4.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v3.0.2...v4.0.0) (2020-01-13)

**Note:** Version bump only for package @pollyjs/persister-in-memory





# [3.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v2.7.0...v3.0.0) (2019-12-18)

**Note:** Version bump only for package @pollyjs/persister-in-memory





## [2.6.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v2.6.2...v2.6.3) (2019-09-30)


### Bug Fixes

* use watch strategy ([#236](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/issues/236)) ([5b4edf3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/commit/5b4edf3))





## [2.6.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/compare/v2.6.1...v2.6.2) (2019-08-05)


### Features

* Adds an in-memory persister to test polly internals ([#237](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/issues/237)) ([5a6fda6](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/persister-in-memory/commit/5a6fda6))
