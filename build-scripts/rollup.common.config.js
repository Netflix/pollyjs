/* globals require process */

import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import deepmerge from 'deepmerge';
import path from 'path';

export const pkg = require(path.resolve(process.cwd(), './package.json'));
const production = process.env.NODE_ENV === 'production';

const banner = `/**
 * ${pkg.name} v${pkg.version}
 *
 * https://github.com/netflix/pollyjs
 *
 * Released under the ${pkg.license} License.
 */`;

export const output = format => {
  return {
    format,
    file: `./dist/${format}/${pkg.name.replace('@pollyjs/', 'pollyjs-')}.js`,
    sourcemap: production,
    banner
  };
};

export default function createCommonConfig(options = {}) {
  return deepmerge(
    {
      input: './src/index.js',
      plugins: [
        json({
          exclude: ['node_modules/**']
        }),
        commonjs(),
        production && uglify()
      ]
    },
    options
  );
}
