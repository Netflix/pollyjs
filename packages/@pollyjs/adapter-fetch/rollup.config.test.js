import createNodeTestConfig from '../../../build-scripts/rollup.node.test.config';
import createBrowserTestConfig from '../../../build-scripts/rollup.browser.test.config';
import createJestTestConfig from '../../../build-scripts/rollup.jest.test.config';

export default [
  createNodeTestConfig(),
  createBrowserTestConfig(),
  createJestTestConfig()
];
