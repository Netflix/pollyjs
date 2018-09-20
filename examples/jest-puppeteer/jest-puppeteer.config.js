module.exports = {
  launch: {
    headless: false
  },
  server: {
    command: '(cd ../dummy-app && yarn start:ci)',
    port: 3000,
    launchTimeout: 60000
  }
};
