import deepmerge from 'deepmerge';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

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
        resolve({ preferBuiltins: true }),
        commonjs(),
        babel({
          babelrc: false,
          runtimeHelpers: true,
          exclude: ['../../../node_modules/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                targets: {
                  node: '6.0.0'
                }
              }
            ]
          ],
          plugins: [
            '@babel/plugin-external-helpers',
            ['@babel/plugin-transform-runtime', { corejs: 2 }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }]
          ]
        }),
        production && terser()
      ]
    },
    options
  );
}
