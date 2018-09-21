// Expose common globals
window.PollyJS = window['@pollyjs/core'];
window.setupPolly = window.PollyJS.setupMocha;
window.expect = window.chai.expect;

// Register the fetch adapter and REST persister
window.PollyJS.Polly.register(window['@pollyjs/adapter-fetch']);
window.PollyJS.Polly.register(window['@pollyjs/persister-rest']);

// Setup Mocha
mocha.setup({ ui: 'bdd', noHighlighting: true });
