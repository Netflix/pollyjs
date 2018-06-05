import deepmerge from 'deepmerge';
import multiEntry from 'rollup-plugin-multi-entry';
import createClientConfig from './rollup.browser.config';
import { pkg } from './rollup.common.config';

export default function createClientTestConfig(options = {}) {
  return deepmerge(
    createClientConfig(
      {
        input: 'tests/**/*-test.js',
        output: {
          format: 'es',
          name: `${pkg.name}-tests`,
          file: `./build/tests/bundle-es.js`,
          intro: `
            'use strict'
            describe('${pkg.name}', function() {
          `,
          outro: '});'
        },
        plugins: [multiEntry()],
        onwarn(warning) {
          if (
            warning.code !== 'CIRCULAR_DEPENDENCY' &&
            !(/nise/.test(warning) && /eval/.test(warning))
          ) {
            console.error(`(!) ${warning.message}`);
          }
        }
      },
      /* target override */
      {
        browsers: ['last 5 Chrome versions']
      }
    ),
    options
  );
}
