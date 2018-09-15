module.exports = {
  launch: {
    headless: false
  },
  server: {
    command: 'BROWSER=none yarn start',
    port: 3000,
    launchTimeout: 60000
  }
};
