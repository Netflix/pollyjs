import createNodeTestConfig from '../../../scripts/rollup/node.test.config';

export default createNodeTestConfig({
  external: ['http', 'https', 'url', 'stream', 'crypto']
});
