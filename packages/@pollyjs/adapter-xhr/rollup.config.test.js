import createBrowserTestConfig from '../../../build-scripts/rollup.browser.test.config';
import createJestTestConfig from '../../../build-scripts/rollup.jest.test.config';

export default [createBrowserTestConfig(), createJestTestConfig()];
