/* eslint-env node */
const path = require('path');
const bodyParser = require('body-parser');
const { registerExpressAPI } = require('../packages/@pollyjs/node-server');

const DB = {};

module.exports = function attachMiddleware(app) {
  registerExpressAPI(app, {
    recordingsDir: path.join(__dirname, '/recordings')
  });

  app.use(bodyParser.json());

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
