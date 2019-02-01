module.exports = {
  env: {
    browser: false,
    node: true
  },
  overrides: [
    {
      files: ['tests/jest/**/*.js'],
      env: {
        browser: true
      }
    }
  ]
};
