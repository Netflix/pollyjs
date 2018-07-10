/* eslint-env node */

module.exports = {
  test_page: 'test/index.mustache',
  before_tests: 'yarn test:build',
  launch_in_ci: ['Chrome', 'Mocha'],
  launch_in_dev: ['Chrome', 'Mocha'],
  watch_files: [
    './build-scripts/**/*',
    './packages/@pollyjs/*/src/**/*',
    './packages/@pollyjs/*/tests*/*/*'
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
    Mocha: {
      command: 'mocha',
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
