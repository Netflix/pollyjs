import deepmerge from 'deepmerge';
import multiEntry from 'rollup-plugin-multi-entry';
import createNodeConfig from './rollup.node.config';
import { pkg } from './rollup.utils';

export default function createNodeTestConfig(options = {}) {
  return deepmerge(
    createNodeConfig({
      input: 'tests/!(browser)/**/*-test.js',
      output: {
        format: 'cjs',
        name: `${pkg.name}-tests`,
        file: `./build/node/test-bundle.cjs.js`,
        intro: `describe('${pkg.name}', function() {`,
        outro: '});'
      },
      plugins: [multiEntry()],
      external: ['chai']
    }),
    options
  );
}
