# Ember CLI

Installing the `@pollyjs/ember` addon will import and vendor the necessary
Polly.JS packages as well as register the [Express API](node-server/express-integrations)
required by the [REST Persister](persisters/rest).

?> __NOTE:__ By default, this addon installs and registers the
[XHR](adapters/xhr) & [Fetch](adapters/fetch) adapters as well as the
[REST](persisters/rest) & [Local Storage](persisters/local-storage) persisters.

## Installation

```bash
ember install @pollyjs/ember
```

## Configuration

Addon and [server API configuration](node-server/overview#api-configuration) can be
be specified in `ember-cli-build.js`. The default configuration options are shown
below.

```js
module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    pollyjs: {
      // Addon Configuration Options
      enabled: EmberApp.env() !== 'production',

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
[QUnit Test Helper](test-frameworks/qunit)!
