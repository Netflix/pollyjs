import deepmerge from 'deepmerge';
import multiEntry from 'rollup-plugin-multi-entry';
import alias from 'rollup-plugin-alias';

import createBrowserConfig from './rollup.browser.config';
import { pkg, testsPath } from './rollup.utils';

export default function createBrowserTestConfig(options = {}) {
  return deepmerge(
    createBrowserConfig(
      {
        input: 'tests/!(node|jest)/**/*-test.js',
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
        plugins: [alias({ '@pollyjs-tests': testsPath }), multiEntry()]
      },
      /* target override */
      {
        browsers: ['last 5 Chrome versions']
      }
    ),
    options
  );
}
