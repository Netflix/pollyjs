import createConfig, { output, pkg } from './rollup.common.config';
import babel from 'rollup-plugin-babel';
import deepmerge from 'deepmerge';

const external = Object.keys(pkg.dependencies || {});

export default function createServerConfig(options = {}) {
  return deepmerge(
    createConfig({
      output: [output('cjs'), output('es')],
      external,
      plugins: [
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
        })
      ]
    }),
    options
  );
}
