import createNodeTestConfig from '../../../scripts/rollup/node.test.config';

export default createNodeTestConfig({
  external: ['rimraf', 'fixturify']
});
