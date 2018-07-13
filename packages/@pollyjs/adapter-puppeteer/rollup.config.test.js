import createNodeTestConfig from '../../../build-scripts/rollup.node.test.config';

export default createNodeTestConfig({
  external: ['@pollyjs/core', '@pollyjs/persister-fs', 'puppeteer']
});
