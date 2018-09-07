import deepmerge from 'deepmerge';
import json from 'rollup-plugin-json';
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import { rollup as lerna } from 'lerna-alias';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
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
          exclude: '../../../node_modules/**',
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                targets: targets || {
                  browsers: ['last 2 versions', 'safari >= 7']
                }
              }
            ]
          ],
          plugins: [
            '@babel/plugin-external-helpers',
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }]
          ]
        }),
        globals(),
        builtins(),
        production && terser()
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
