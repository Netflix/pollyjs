// Expose common globals
window.PollyJS = window['@pollyjs/core'];
window.setupPolly = window.PollyJS.setupMocha;
window.expect = window.chai.expect;
window.API_HOST = 'https://jsonplaceholder.typicode.com';

// Register the fetch adapter and local-storage persister
window.PollyJS.Polly.register(window['@pollyjs/adapter-fetch']);
window.PollyJS.Polly.register(window['@pollyjs/persister-local-storage']);

// Setup Mocha
mocha.setup({ ui: 'bdd', noHighlighting: true });
