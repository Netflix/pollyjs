import createNodeTestConfig from '../../../scripts/rollup/node.test.config';
import createBrowserTestConfig from '../../../scripts/rollup/browser.test.config';

export default [createNodeTestConfig(), createBrowserTestConfig()];
