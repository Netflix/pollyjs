/* eslint-env node */
const path = require('path');
const bodyParser = require('body-parser');
const Server = require('../packages/@pollyjs/node-server').Server;
const server = new Server({
  port: 4000,
  quiet: true,
  recordingsDir: path.join(__dirname, '/recordings')
});
const app = server.app;
const DB = {};

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

server.listen();
