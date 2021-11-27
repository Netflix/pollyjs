'use strict';

module.exports = {
  description: 'Setup @pollyjs/ember',
  normalizeEntityName() {},
  afterInstall() {
    return this.addPackagesToProject([
      { name: '@pollyjs/adapter-fetch' },
      { name: '@pollyjs/adapter-xhr' },
      { name: '@pollyjs/core' },
      { name: '@pollyjs/node-server' },
      { name: '@pollyjs/persister-local-storage' },
      { name: '@pollyjs/persister-rest' },
    ]);
  },
};
