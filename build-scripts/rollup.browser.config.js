import deepmerge from 'deepmerge';
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import { rollup as lerna } from 'lerna-alias';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import { input, output, pkg, production } from './rollup.utils';

export default function createBrowserConfig(options = {}, targets) {
  return deepmerge(
    {
      input,
      output: deepmerge(output('umd'), { name: pkg.name }),
      plugins: [
        alias(lerna()),
        json(),
        resolve({ browser: true }),
        commonjs(),
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
