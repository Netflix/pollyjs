import createBrowserConfig from './build-scripts/rollup.browser.config';
import createNodeConfig from './build-scripts/rollup.node.config';

export default [createBrowserConfig() /*, createNodeConfig()*/];
