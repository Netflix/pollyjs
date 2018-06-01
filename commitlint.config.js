/* eslint-env node */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-full-stop': [2, 'always', '.'],
    'subject-case': [2, 'always', ['sentence-case']]
  }
};
