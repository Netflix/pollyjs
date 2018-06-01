import createServerConfig from '../../../build-scripts/rollup.node.config';

export default createServerConfig({
  external: ['path']
});
