/* eslint-env node */

module.exports = {
  test_page: 'test/index.mustache',
  before_tests: 'yarn test:build',
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  watch_files: [
    './packages/@pollyjs/*/src/**/*',
    './packages/@pollyjs/*/tests/*/*'
  ],
  serve_files: ['./packages/@pollyjs/*/build/tests/**/*.js'],
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
  proxies: {
    '/api': {
      target: 'http://localhost:4000'
    },
    '/polly': {
      target: 'http://localhost:4000'
    }
  }
};
