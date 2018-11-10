import deepmerge from 'deepmerge';
import multiEntry from 'rollup-plugin-multi-entry';
import alias from 'rollup-plugin-alias';

import createNodeConfig from './rollup.node.config';
import { pkg, testsPath } from './rollup.utils';

const pollyDependencies = Object.keys(pkg.devDependencies || {}).filter(d =>
  d.startsWith('@pollyjs')
);

export default function createNodeTestConfig(options = {}) {
  return deepmerge(
    createNodeConfig({
      input: 'tests/!(browser|jest)/**/*-test.js',
      output: {
        format: 'cjs',
        name: `${pkg.name}-tests`,
        file: `./build/node/test-bundle.cjs.js`,
        intro: `describe('${pkg.name}', function() {`,
        outro: '});'
      },
      plugins: [alias({ '@pollyjs-tests': testsPath }), multiEntry()],
      external: [...pollyDependencies, 'node-fetch', 'chai']
    }),
    options
  );
}
