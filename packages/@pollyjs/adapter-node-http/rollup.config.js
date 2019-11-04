import createNodeConfig from '../../../scripts/rollup/node.config';

export default createNodeConfig({
  external: ['http', 'https', 'url', 'stream', 'timers', 'tty', 'util', 'os']
});
