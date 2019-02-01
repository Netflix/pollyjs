import createBrowserTestConfig from '../../../scripts/rollup/browser.test.config';
import createJestTestConfig from '../../../scripts/rollup/jest.test.config';

export default [createBrowserTestConfig(), createJestTestConfig()];
