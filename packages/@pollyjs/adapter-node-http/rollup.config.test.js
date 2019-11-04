import createNodeTestConfig from '../../../scripts/rollup/node.test.config';
import createJestTestConfig from '../../../scripts/rollup/jest.test.config';

const external = [
  'http',
  'https',
  'url',
  'stream',
  'crypto',
  'timers',
  'tty',
  'util',
  'os'
];

export default [
  createNodeTestConfig({ external }),
  createJestTestConfig({ external })
];
