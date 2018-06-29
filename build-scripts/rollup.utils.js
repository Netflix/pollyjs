/* globals require process */

import path from 'path';

export const pkg = require(path.resolve(process.cwd(), './package.json'));
export const production = process.env.NODE_ENV === 'production';
export const input = './src/index.js';

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
    file: `./dist/${format}/${pkg.name.replace('@pollyjs/', 'pollyjs-')}.${
      production ? 'min.js' : 'js'
    }`,
    sourcemap: production,
    banner
  };
};
