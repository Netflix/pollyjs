import createNodeConfig from '../../../build-scripts/rollup.node.config';

export default createNodeConfig({
  external: ['zlib', 'http', 'https']
});
