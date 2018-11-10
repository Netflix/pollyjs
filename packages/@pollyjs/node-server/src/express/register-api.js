import bodyParser from 'body-parser';
import express from 'express';
import nocache from 'nocache';

import API from '../api';
import DefaultConfig from '../config';

function prependSlash(slash = '') {
  if (slash.startsWith('/')) {
    return slash;
  }

  return `/${slash}`;
}

export default function registerAPI(app, config) {
  config = { ...DefaultConfig, ...config };
  config.apiNamespace = prependSlash(config.apiNamespace);

  const router = express.Router();
  const api = new API({ recordingsDir: config.recordingsDir });

  router.use(nocache());

  router.get('/:recording', function(req, res) {
    const { recording } = req.params;
    const { status, body } = api.getRecording(recording);

    res.status(status);

    if (status === 200) {
      res.json(body);
    } else {
      res.end();
    }
  });

  router.post(
    '/:recording',
    bodyParser.json({ limit: config.recordingSizeLimit }),
    function(req, res) {
      const { recording } = req.params;
      const { status, body } = api.saveRecording(recording, req.body);

      res.status(status).send(body);
    }
  );

  router.delete('/:recording', function(req, res) {
    const { recording } = req.params;
    const { status, body } = api.deleteRecording(recording);

    res.status(status).send(body);
  });

  app.use(config.apiNamespace, router);
}
