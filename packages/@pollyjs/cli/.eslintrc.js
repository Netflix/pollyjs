module.exports = {
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2015
  },
  env: {
    browser: false,
    node: true
  },
  plugins: ['node'],
  rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
    // add your custom rules and overrides for node files here
  })
};
