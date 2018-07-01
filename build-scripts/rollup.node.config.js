import deepmerge from 'deepmerge';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import { input, output, pkg, production } from './rollup.utils';

const external = Object.keys(pkg.dependencies || {});

export default function createNodeConfig(options = {}) {
  return deepmerge(
    {
      input,
      output: [output('cjs'), output('es')],
      external,
      plugins: [
        json(),
        resolve(),
        commonjs(),
        babel({
          babelrc: false,
          runtimeHelpers: true,
          presets: [
            [
              'env',
              {
                modules: false,
                targets: {
                  node: 6
                }
              }
            ]
          ],
          plugins: [
            'external-helpers',
            'transform-runtime',
            ['transform-object-rest-spread', { useBuiltIns: true }]
          ],
          exclude: ['node_modules/**'],
          ignore: 'node_modules/**'
        }),
        production && uglify()
      ]
    },
    options
  );
}
