import createNodeTestConfig from '../../../scripts/rollup/node.test.config';
import createBrowserTestConfig from '../../../scripts/rollup/browser.test.config';
import createJestTestConfig from '../../../scripts/rollup/jest.test.config';

export default [
  createNodeTestConfig(),
  createBrowserTestConfig(),
  createJestTestConfig()
];
