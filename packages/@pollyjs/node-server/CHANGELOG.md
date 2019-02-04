# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/v2.0.0...v2.1.0) (2019-02-04)

**Note:** Version bump only for package @pollyjs/node-server





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/v1.4.2...v2.0.0) (2019-01-29)

**Note:** Version bump only for package @pollyjs/node-server





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/node-server





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/node-server





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/v1.2.0...v1.3.1) (2018-11-28)

**Note:** Version bump only for package @pollyjs/node-server





<a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* Do not display node server listening banner in quiet mode ([1be57a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/1be57a7))
* Rest server on Windows ([be5c473](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/be5c473))


### Features

* **node-server:** Add cors support to express server to pass-through all requests ([223ce4e](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/223ce4e))
* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/a04d7a7))
* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/e622640))
* Make recording size limit configurable ([#40](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/40)) ([d4be431](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/d4be431))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/0a0eeca))
* Presets persisterOptions.host to the node server default ([0b47838](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/0b47838))
* Use status code 204 in place of 404. ([#5](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/5)) ([930c492](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/930c492))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="1.0.3"></a>
## [1.0.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/@pollyjs/node-server@1.0.2...@pollyjs/node-server@1.0.3) (2018-08-22)




**Note:** Version bump only for package @pollyjs/node-server

<a name="1.0.2"></a>
## [1.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/@pollyjs/node-server@1.0.1...@pollyjs/node-server@1.0.2) (2018-08-12)




**Note:** Version bump only for package @pollyjs/node-server

<a name="1.0.1"></a>
## [1.0.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/@pollyjs/node-server@1.0.0...@pollyjs/node-server@1.0.1) (2018-08-12)




**Note:** Version bump only for package @pollyjs/node-server

<a name="1.0.0"></a>
# [1.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/@pollyjs/node-server@0.4.0...@pollyjs/node-server@1.0.0) (2018-07-20)


### Features

* Convert recordings to be HAR compliant ([#45](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/45)) ([e622640](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/e622640))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/0a0eeca))
* Presets persisterOptions.host to the node server default ([0b47838](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/0b47838))


### BREAKING CHANGES

* Recordings now produce HAR compliant json. Please delete existing recordings.




<a name="0.4.0"></a>
# [0.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/@pollyjs/node-server@0.3.0...@pollyjs/node-server@0.4.0) (2018-06-29)


### Bug Fixes

* Do not display node server listening banner in quiet mode ([1be57a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/1be57a7))


### Features

* **node-server:** Add cors support to express server to pass-through all requests ([223ce4e](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/223ce4e))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/@pollyjs/node-server@0.2.0...@pollyjs/node-server@0.3.0) (2018-06-27)


### Features

* Make recording size limit configurable ([#40](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/40)) ([d4be431](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/d4be431))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/compare/@pollyjs/node-server@0.1.0...@pollyjs/node-server@0.2.0) (2018-06-21)


### Bug Fixes

* Rest server on Windows ([be5c473](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/be5c473))


### Features

* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/node-server/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/node-server/commit/a04d7a7))
