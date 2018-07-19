/* eslint-env node */

module.exports = {
  testURL: 'http://localhost:4000/api',
  testMatch: ['**/@pollyjs/*/build/jest/*.js'],
  reporters: ['jest-tap-reporter']
};
