import createNodeTestConfig from '../../../scripts/rollup/node.test.config';
import createJestTestConfig from '../../../scripts/rollup/jest.test.config';

const external = ['http', 'https', 'url', 'stream', 'crypto'];

export default [
  createNodeTestConfig({ external }),
  createJestTestConfig({ external })
];
