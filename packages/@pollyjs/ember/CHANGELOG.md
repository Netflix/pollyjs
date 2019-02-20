# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/v2.1.0...v2.2.0) (2019-02-20)

**Note:** Version bump only for package @pollyjs/ember





# [2.1.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/v2.0.0...v2.1.0) (2019-02-04)

**Note:** Version bump only for package @pollyjs/ember





# [2.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/v1.4.2...v2.0.0) (2019-01-29)


### Bug Fixes

* **ember:** Remove Node 6 from supported versions ([#169](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/169)) ([07b2b4e](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/07b2b4e))





## [1.4.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/v1.4.1...v1.4.2) (2019-01-16)

**Note:** Version bump only for package @pollyjs/ember





## [1.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/v1.4.0...v1.4.1) (2018-12-13)

**Note:** Version bump only for package @pollyjs/ember





## [1.3.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/v1.3.1...v1.3.2) (2018-11-29)

**Note:** Version bump only for package @pollyjs/ember





## [1.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/v1.2.0...v1.3.1) (2018-11-28)

**Note:** Version bump only for package @pollyjs/ember





      <a name="1.2.0"></a>
# 1.2.0 (2018-09-16)


### Bug Fixes

* Bumping core within Ember ([af4faa1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/af4faa1))
* Ensure polly's middleware goes before ember-cli's ([#36](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/36)) ([43db361](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/43db361))
* **core:** Set `url` on the fetch Response object ([#44](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/44)) ([f5980cf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/f5980cf)), closes [#43](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/issues/43)
* **ember:** Fix auto-register and add tests to cover ([24c15bd](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/24c15bd))


### Features

* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/0a3d591))
* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/8bb313c))
* Improved adapter and persister registration ([#62](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/62)) ([164dbac](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/164dbac))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/29ed8e1))
* Make recording size limit configurable ([#40](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/40)) ([d4be431](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/d4be431))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/0a0eeca))
* Presets persisterOptions.host to the node server default ([0b47838](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/0b47838))


### BREAKING CHANGES

* __Adapters__

```js
import { XHRAdapter, FetchAdapter } from '@pollyjs/core';

// Register the xhr adapter so its accessible by all future polly instances
Polly.register(XHRAdapter);

polly.configure({
adapters: ['xhr', FetchAdapter]
});
```

__Persister__

```js
import { LocalStoragePersister, RESTPersister } from '@pollyjs/core';

// Register the local-storage persister so its accessible by all future polly instances
Polly.register(LocalStoragePersister);

polly.configure({
persister: 'local-storage'
});

polly.configure({
persister: RESTPersister
});
```




      <a name="1.0.5"></a>
## [1.0.5](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@1.0.4...@pollyjs/ember@1.0.5) (2018-08-22)


### Bug Fixes

* **ember:** Fix auto-register and add tests to cover ([24c15bd](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/24c15bd))




<a name="1.0.4"></a>
## [1.0.4](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@1.0.3...@pollyjs/ember@1.0.4) (2018-08-12)




**Note:** Version bump only for package @pollyjs/ember

<a name="1.0.3"></a>
## [1.0.3](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@1.0.2...@pollyjs/ember@1.0.3) (2018-08-12)




**Note:** Version bump only for package @pollyjs/ember

<a name="1.0.2"></a>
## [1.0.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@1.0.1...@pollyjs/ember@1.0.2) (2018-08-09)




**Note:** Version bump only for package @pollyjs/ember

<a name="1.0.1"></a>
## [1.0.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@1.0.0...@pollyjs/ember@1.0.1) (2018-07-26)




**Note:** Version bump only for package @pollyjs/ember

<a name="1.0.0"></a>
# [1.0.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.4.2...@pollyjs/ember@1.0.0) (2018-07-20)


### Features

* Class events and EventEmitter ([#52](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/52)) ([0a3d591](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/0a3d591))
* Improved adapter and persister registration ([#62](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/62)) ([164dbac](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/164dbac))
* Keyed persister & adapter options ([#60](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/60)) ([29ed8e1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/29ed8e1))
* Node File System Persister ([#61](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/61)) ([0a0eeca](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/0a0eeca))
* Presets persisterOptions.host to the node server default ([0b47838](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/0b47838))


### BREAKING CHANGES

* __Adapters__

```js
import { XHRAdapter, FetchAdapter } from '@pollyjs/core';

// Register the xhr adapter so its accessible by all future polly instances
Polly.register(XHRAdapter);

polly.configure({
adapters: ['xhr', FetchAdapter]
});
```

__Persister__

```js
import { LocalStoragePersister, RESTPersister } from '@pollyjs/core';

// Register the local-storage persister so its accessible by all future polly instances
Polly.register(LocalStoragePersister);

polly.configure({
persister: 'local-storage'
});

polly.configure({
persister: RESTPersister
});
```




<a name="0.4.2"></a>
## [0.4.2](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.4.1...@pollyjs/ember@0.4.2) (2018-06-29)




**Note:** Version bump only for package @pollyjs/ember

<a name="0.4.1"></a>
## [0.4.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.4.0...@pollyjs/ember@0.4.1) (2018-06-27)




**Note:** Version bump only for package @pollyjs/ember

<a name="0.4.0"></a>
# [0.4.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.3.1...@pollyjs/ember@0.4.0) (2018-06-27)


### Bug Fixes

* **core:** Set `url` on the fetch Response object ([#44](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/44)) ([f5980cf](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/f5980cf)), closes [#43](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/issues/43)


### Features

* Make recording size limit configurable ([#40](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/40)) ([d4be431](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/d4be431))




<a name="0.3.1"></a>
## [0.3.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.3.0...@pollyjs/ember@0.3.1) (2018-06-22)


### Bug Fixes

* Bumping core within Ember ([af4faa1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/af4faa1))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.2.1...@pollyjs/ember@0.3.0) (2018-06-22)




**Note:** Version bump only for package @pollyjs/ember

<a name="0.2.1"></a>
## [0.2.1](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.2.0...@pollyjs/ember@0.2.1) (2018-06-21)


### Bug Fixes

* Ensure polly's middleware goes before ember-cli's ([#36](https://github.com/netflix/pollyjs/tree/master/packages/[@pollyjs](https://github.com/pollyjs)/ember/issues/36)) ([43db361](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/43db361))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/compare/@pollyjs/ember@0.1.0...@pollyjs/ember@0.2.0) (2018-06-16)


### Features

* Custom persister support ([8bb313c](https://github.com/netflix/pollyjs/tree/master/packages/@pollyjs/ember/commit/8bb313c))
