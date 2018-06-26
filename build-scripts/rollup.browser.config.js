import deepmerge from 'deepmerge';
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import { rollup as lerna } from 'lerna-alias';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import createCommonConfig, { output, pkg } from './rollup.common.config';

export default function createClientConfig(options = {}, targets) {
  return deepmerge(
    createCommonConfig({
      output: deepmerge(output('umd'), { name: pkg.name }),
      plugins: [
        alias(lerna()),
        resolve({ browser: true }),
        builtins(),
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
        })
      ],
      onwarn(message) {
        /* nise uses eval for strings within native fns setTimeout('alert("foo")', 10) */
        if (/nise/.test(message) && /eval/.test(message)) {
          return;
        }

        console.error(message);
      }
    }),
    options
  );
}
