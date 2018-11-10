/* eslint-env node */
const attachMiddleware = require('./tests/middleware');

module.exports = {
  port: 4000,
  fail_on_zero_tests: true,
  test_page: 'tests/index.mustache',
  on_start: 'yarn test:clean',
  before_tests: 'npm-run-all --parallel build test:build',
  on_exit: 'yarn test:clean',
  launch_in_ci: ['Chrome', 'Node', 'Jest', 'Ember', 'ESLint'],
  launch_in_dev: ['Chrome', 'Node', 'Jest', 'Ember', 'ESLint'],
  watch_files: [
    './build-scripts/**/*',
    './tests/*',
    './tests/!(recordings)/**/*',
    './packages/@pollyjs/*/src/**/*',
    './packages/@pollyjs/*/tests/**/*'
  ],
  serve_files: ['./packages/@pollyjs/*/build/browser/*.js'],
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  },
  middleware: [attachMiddleware],
  launchers: {
    Node: {
      command: 'yarn test:node --reporter tap',
      protocol: 'tap'
    },
    Jest: {
      command: 'yarn test:jest',
      protocol: 'tap'
    },
    Ember: {
      command: 'yarn test:ember',
      protocol: 'tap'
    },
    ESLint: {
      command: 'yarn lint --format tap',
      protocol: 'tap'
    }
  }
};
