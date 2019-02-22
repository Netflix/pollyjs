## Prerequisites

- We realize there is a lot of data requested here. We ask only that you do your best to provide as much information as possible so we can better help you.
- Read the [contributing guidelines](https://github.com/Netflix/pollyjs/blob/master/CONTRIBUTING.md).
- Ensure the issue isn't already reported.
- Should be reproducible with the latest @pollyjs package versions.

> _Delete the above section and the instructions in the sections below before submitting_

## Description

If this is a feature request, explain why it should be added. Specific use-cases are best.

For bug reports, please provide as much _relevant_ info as possible.

### Shareable Source

```js
// Avoid posting hundreds of lines of source code.
// Edit to just the relevant portions.
```

### Error Message & Stack Trace

```
COPY THE ERROR MESSAGE, INCLUDING STACK TRACE HERE
```

### Config

Copy the config used to setup the Polly instance:

```js
new Polly('Recording Name', {
  // config...
});
```

### Dependencies

Copy the @pollyjs dependencies from `package.json`:

```json
{
  "@pollyjs/core": "latest",
  "@pollyjs/adapter-x": "latest",
  "@pollyjs/persister-x": "latest"
}
```

## Relevant Links

- If your project is public, link to the repo so we can investigate directly.
- **BONUS POINTS:** Create a [minimal reproduction](http://stackoverflow.com/help/mcve) and upload it to GitHub. This will get you the fastest support.

## Environment

Tell us which operating system you are using, as well as which versions of Node.js and npm/yarn. If applicable, include the browser and the corresponding version.

Run the following to get it quickly:

```
node -e "var os=require('os');console.log('Node.js ' + process.version + '\n' + os.platform() + ' ' + os.release())"
npm --version
yarn --version
```
