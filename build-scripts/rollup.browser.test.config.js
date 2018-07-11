import deepmerge from 'deepmerge';
import multiEntry from 'rollup-plugin-multi-entry';
import createBrowserConfig from './rollup.browser.config';
import { pkg } from './rollup.utils';

export default function createBrowserTestConfig(options = {}) {
  return deepmerge(
    createBrowserConfig(
      {
        input: 'tests/!(node)/**/*-test.js',
        output: {
          format: 'es',
          name: `${pkg.name}-tests`,
          file: `./build/browser/test-bundle.es.js`,
          intro: `
            'use strict'
            describe('${pkg.name}', function() {
          `,
          outro: '});'
        },
        plugins: [multiEntry()]
      },
      /* target override */
      {
        browsers: ['last 5 Chrome versions']
      }
    ),
    options
  );
}
