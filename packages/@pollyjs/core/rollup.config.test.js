import createNodeTestConfig from '../../../build-scripts/rollup.node.test.config';
import createBrowserTestConfig from '../../../build-scripts/rollup.browser.test.config';

export default [createNodeTestConfig(), createBrowserTestConfig()];
