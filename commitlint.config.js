/* eslint-env node */

module.exports = {
  extends: [
    '@commitlint/config-lerna-scopes',
    '@commitlint/config-conventional'
  ],
  rules: {
    'subject-full-stop': [2, 'always', '.'],
    'subject-case': [2, 'always', ['sentence-case']]
  }
};
