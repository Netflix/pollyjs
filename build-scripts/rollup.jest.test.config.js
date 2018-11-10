import deepmerge from 'deepmerge';

import createNodeTestConfig from './rollup.node.test.config';
import { pkg } from './rollup.utils';

export default function createJestTestConfig(options = {}) {
  return deepmerge(
    createNodeTestConfig({
      input: 'tests/jest/**/*-test.js',
      output: {
        format: 'cjs',
        name: `${pkg.name}-tests`,
        file: `./build/jest/test-bundle.cjs.js`,
        intro: `describe('${pkg.name}', function() {`,
        outro: '});'
      }
    }),
    options
  );
}
