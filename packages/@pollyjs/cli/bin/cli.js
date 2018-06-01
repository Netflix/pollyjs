#!/usr/bin/env node

// Provide a title to the process in `ps`
process.title = 'polly';

var Polly = require('@pollyjs/node-server');
var cli = require('commander');
var version = require('../package.json').version;

cli.name('polly').version(version, '-v, --version');

cli
  .command('listen')
  .alias('l')
  .description('start the server and listen for requests')
  .option('-H, --host <host>', 'host')
  .option('-p, --port <port>', 'port number', Polly.Defaults.port)
  .option(
    '-n, --namespace <namespace>',
    'api namespace',
    Polly.Defaults.namespace
  )
  .option(
    '-rd, --recordings-dir <path>',
    'recordings directory',
    Polly.Defaults.recordingsDir
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
