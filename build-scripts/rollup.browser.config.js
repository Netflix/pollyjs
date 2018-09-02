/* globals process */

import path from 'path';
import deepmerge from 'deepmerge';
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import { rollup as lerna } from 'lerna-alias';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import multiEntry from 'rollup-plugin-multi-entry';
import typescript from 'typescript';
import { input, output, pkg, production, rootPath } from './rollup.utils';

export default function createBrowserConfig(options = {}, targets) {
  return deepmerge(
    {
      input,
      output: deepmerge(output('umd'), { name: pkg.name }),
      plugins: [
        alias(lerna()),
        json(),
        resolve({ browser: true }),
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
                targets: targets || {
                  browsers: ['last 2 versions', 'safari >= 7']
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
        globals(),
        builtins(),
        multiEntry(),
        production && uglify()
      ],
      onwarn(message) {
        /* nise uses eval for strings within native fns setTimeout('alert("foo")', 10) */
        if (/nise/.test(message) && /eval/.test(message)) {
          return;
        }

        console.error(message);
      }
    },
    options
  );
}
