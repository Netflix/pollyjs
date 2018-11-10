/* global process */

import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import gracefulShutdown from 'http-graceful-shutdown';

import registerAPI from './express/register-api';
import DefaultConfig from './config';

export default class Server {
  constructor(config = {}) {
    this.config = { ...DefaultConfig, ...config };
    this.app = express();
    this.app.use(cors());

    if (!this.config.quiet) {
      this.app.use(morgan('dev'));
    }

    // Return 200 on root GET & HEAD to pass health checks
    this.app.get('/', (req, res) => res.sendStatus(200));
    this.app.head('/', (req, res) => res.sendStatus(200));

    registerAPI(this.app, {
      recordingsDir: this.config.recordingsDir,
      apiNamespace: this.config.apiNamespace
    });
  }

  listen(port, host) {
    if (this.server) {
      return;
    }

    port = port || this.config.port;
    host = host || this.config.host;

    this.server = this.app
      .listen(port, host)
      .on('listening', () => {
        if (!this.config.quiet) {
          console.log(`Listening on http://${host || 'localhost'}:${port}/\n`);
        }
      })
      .on('error', e => {
        if (e.code === 'EADDRINUSE') {
          console.error(`Port ${port} already in use.`);
          process.exit(1);
        } else {
          console.error(e);
        }
      });

    gracefulShutdown(this.server);

    return this.server;
  }
}
