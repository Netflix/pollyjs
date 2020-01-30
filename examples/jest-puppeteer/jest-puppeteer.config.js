module.exports = {
  launch: {
    headless: true
  },
  server: {
    command: '(cd ../dummy-app && yarn start:ci)',
    port: 3000,
    launchTimeout: 60000
  }
};
