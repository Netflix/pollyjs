/* eslint-env node */
const path = require('path');

const bodyParser = require('body-parser');
const compression = require('compression');

const { registerExpressAPI } = require('../packages/@pollyjs/node-server');

const DB = {};

module.exports = function attachMiddleware(app) {
  registerExpressAPI(app, {
    recordingsDir: path.join(__dirname, 'recordings')
  });

  app.get('/assets/:name', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', req.params.name));
  });

  app.use(bodyParser.json());

  app.get('/echo', (req, res) => {
    const status = req.query.status;

    if (status === '204') {
      res.status(204).send();
    } else {
      res.sendStatus(req.query.status);
    }
  });

  app.post('/compress', compression({ filter: () => true }), (req, res) => {
    res.write(JSON.stringify(req.body));
    res.end();
  });

  app.get('/api', (req, res) => {
    res.sendStatus(200);
  });

  app.get('/api/db/:id', (req, res) => {
    const { id } = req.params;

    if (DB[id]) {
      res.status(200).json(DB[id]);
    } else {
      res.status(404).end();
    }
  });

  app.post('/api/db/:id', (req, res) => {
    const { id } = req.params;

    DB[id] = req.body;
    res.status(200).json(DB[id]);
  });

  app.delete('/api/db/:id', (req, res) => {
    const { id } = req.params;

    delete DB[id];
    res.status(200).end();
  });
};
