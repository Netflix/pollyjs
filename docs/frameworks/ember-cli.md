# Ember CLI

Installing the `@pollyjs/ember` addon will import and vendor the necessary
Polly.JS packages as well as register the express API required by the
[REST Persister](persisters/rest).

## Installation

```bash
ember install @pollyjs/ember
```

## Configuration

You can specify [server configuration](node-server/overview#configuration)
options in `config/environment.js`:

```js
{
  '@pollyjs/ember': {
    recordingsDir: '__recordings__',
    namespace: 'polly_js'
  }
}
```
