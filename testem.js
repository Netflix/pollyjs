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
    './packages/@pollyjs/*/tests/*/*'
  ],
  serve_files: ['./packages/@pollyjs/*/build/browser/*.js'],
  browser_args: {
    Chrome: {
      mode: 'ci',
      args: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.TRAVIS ? '--no-sandbox' : null,
        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  },
  middleware: [attachMiddleware],
  launchers: {
    Node: {
      command:
        'mocha ./packages/@pollyjs/*/build/node/*.js --ui bdd --reporter tap --require tests/node-setup.js',
      protocol: 'tap'
    },
    Jest: {
      command: 'jest',
      protocol: 'tap'
    },
    Ember: {
      command: 'yarn test:ember',
      protocol: 'tap'
    },
    ESLint: {
      command: 'yarn lint -- -- --format tap >&1 | tap-merge',
      protocol: 'tap'
    }
  }
};
