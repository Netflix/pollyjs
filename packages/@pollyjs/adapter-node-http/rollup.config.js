import createNodeConfig from '../../../build-scripts/rollup.node.config';

export default createNodeConfig({
  external: ['http', 'https', 'url']
});
