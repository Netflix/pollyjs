/* eslint-env node */

module.exports = {
  test_page: 'tests/index.mustache',
  before_tests: 'yarn test:build',
  launch_in_ci: ['Chrome', 'Node', 'Ember', 'ESLint'],
  launch_in_dev: ['Chrome', 'Node', 'Ember', 'ESLint'],
  watch_files: [
    './build-scripts/**/*',
    './tests/**/*',
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
  launchers: {
    Node: {
      command:
        'mocha ./packages/@pollyjs/*/build/node/*.js --ui bdd --reporter tap --require tests/node-setup.js',
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
  },
  proxies: {
    '/api': {
      target: 'http://localhost:4000'
    },
    '/polly': {
      target: 'http://localhost:4000'
    }
  }
};
