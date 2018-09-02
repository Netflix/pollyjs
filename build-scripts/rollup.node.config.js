/* globals process */

import path from 'path';
import deepmerge from 'deepmerge';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import multiEntry from 'rollup-plugin-multi-entry';
import typescript2 from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import { input, output, pkg, production, rootPath } from './rollup.utils';

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
        typescript2({
          typescript,
          verbosity: 2,
          useTsconfigDeclarationDir: true,
          cacheRoot: path.resolve(rootPath, '.rts2_cache'),
          tsconfigOverride: {
            compilerOptions: {
              sourceMap: production,
              declaration: true,
              declarationDir: path.resolve(process.cwd(), 'dist/types')
            }
          }
        }),
        commonjs({ extensions: ['.js', '.ts', '.json'] }),
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
        multiEntry(),
        production && uglify()
      ]
    },
    options
  );
}
