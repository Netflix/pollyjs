# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.5.0"></a>
# [0.5.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.4.0...@pollyjs/core@0.5.0) (2018-06-27)


### Bug Fixes

* **core:** Set `url` on the fetch Response object ([#44](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/44)) ([f5980cf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/f5980cf)), closes [#43](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/issues/43)


### Features

* **core:** Normalize headers by lower-casing all keys ([#42](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/42)) ([02a4767](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/02a4767))


### BREAKING CHANGES

* **core:** With this change, request ids will resolve to a different hash meaning that users will have to rerecord.




<a name="0.4.0"></a>
# [0.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.3.0...@pollyjs/core@0.4.0) (2018-06-22)


### Bug Fixes

* Correctly normalize relative URLs ([b9b23cd](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/b9b23cd))


### BREAKING CHANGES

* Relative URLs will have different hashes and will
require to re-record.




<a name="0.3.0"></a>
# [0.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.2.0...@pollyjs/core@0.3.0) (2018-06-21)


### Features

* **persister:** Cache recordings ([#31](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/core/issues/31)) ([a04d7a7](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/a04d7a7))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/compare/@pollyjs/core@0.1.0...@pollyjs/core@0.2.0) (2018-06-16)


### Features

* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/core/commit/8bb313c))
