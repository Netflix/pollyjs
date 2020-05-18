import createNodeTestConfig from '../../../scripts/rollup/node.test.config';
import createJestTestConfig from '../../../scripts/rollup/jest.test.config';

import { external } from './rollup.config.shared';

const testExternal = [...external, 'fs', 'path'];

export default [
  createNodeTestConfig({ external: testExternal }),
  createJestTestConfig({ external: testExternal })
];
