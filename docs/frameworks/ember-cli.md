# Ember CLI

Installing the `@pollyjs/ember` addon will import and vendor the necessary
Polly.JS packages as well as register the [Express API](node-server/express-integrations)
required by the [REST Persister](persisters/rest).

## Installation

```bash
ember install @pollyjs/ember
```

## Configuration

Addon and [server API configuration](node-server/overview#api-configuration) can be
be specified in `ember-cli-build.js`. By default, the addon will only be
enabled in non-production environments.

```js
module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    pollyjs: {
      // Addon Configuration Options
      enabled: EmberApp.env() !== 'production'

      // Server Configuration Options
      server: {
        apiNamespace: 'polly',
        recordingsDir: 'recordings'
      }
    }
  });

  return app.toTree();
};
```

## Usage

Once installed and configured, you can import and use Polly as documented. Check
out the [Quick Start](quick-start#usage) documentation to get started.

?> For an even better testing experience, check out the provided
[QUnit Test Helper](testing-frameworks/qunit)!
