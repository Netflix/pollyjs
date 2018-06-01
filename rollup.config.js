import createClientConfig from './build-scripts/rollup.browser.config';
import createServerConfig from './build-scripts/rollup.node.config';

export default [createClientConfig(), createServerConfig()];
