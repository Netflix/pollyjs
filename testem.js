/* eslint-env node */
const attachMiddleware = require('./tests/middleware');

module.exports = {
  port: 4000,
  fail_on_zero_tests: true,
  test_page: 'tests/index.mustache',
  launch_in_ci: ['Chrome', 'Node', 'Jest', 'Ember', 'ESLint'],
  launch_in_dev: ['Chrome', 'Node', 'Jest', 'Ember', 'ESLint'],
  watch_files: [
    './scripts/rollup/*',
    './packages/@pollyjs/*/build/**/*',
    './packages/@pollyjs/*/dist/**/*'
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
    'Node:debug': {
      command: 'mocha --inspect-brk'
    },
    Node: {
      command: 'mocha --reporter tap',
      protocol: 'tap'
    },
    Jest: {
      command: 'jest',
      protocol: 'tap'
    },
    Ember: {
      command: 'yarn workspace @pollyjs/ember run test',
      protocol: 'tap'
    },
    ESLint: {
      command: 'yarn lint --format tap',
      protocol: 'tap'
    }
  }
};
