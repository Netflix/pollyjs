import createNodeTestConfig from '../../../build-scripts/rollup.node.test.config';

export default createNodeTestConfig({
  external: ['@pollyjs/core', 'mock-fs']
});
