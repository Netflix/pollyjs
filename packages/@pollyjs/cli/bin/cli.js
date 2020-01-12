#!/usr/bin/env node

// Provide a title to the process in `ps`
process.title = 'polly';

const Polly = require('@pollyjs/node-server');
const cli = require('commander');

const version = require('../package.json').version;

cli.name('polly').version(version, '-v, --version');

cli
  .command('listen')
  .alias('l')
  .description('start the server and listen for requests')
  .option('-H, --host <host>', 'host')
  .option('-p, --port <port>', 'port number', Polly.Defaults.port)
  .option(
    '-n, --api-namespace <namespace>',
    'api namespace',
    Polly.Defaults.apiNamespace
  )
  .option(
    '-d, --recordings-dir <path>',
    'recordings directory',
    Polly.Defaults.recordingsDir
  )
  .option(
    '-s, --recording-size-limit <limit>',
    'recording size limit',
    Polly.Defaults.recordingSizeLimit
  )
  .option('-q, --quiet', 'disable the logging')
  .action(function(options) {
    new Polly.Server(options).listen();
  });

cli.parse(process.argv);

// if cli was called with no arguments, show help.
if (cli.args.length === 0) {
  cli.help();
}
