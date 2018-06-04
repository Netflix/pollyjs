import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import nocache from 'nocache';
import API from '../api';
import DefaultConfig from '../config';

export default function registerAPI(app, config) {
  config = { ...DefaultConfig, ...config };
  config.namespace = path.join('/', config.namespace);

  const router = express.Router();
  const api = new API(config.recordingsDir);

  router.use(nocache());

  router.get('/:recording/:entryId', function(req, res) {
    const { recording, entryId } = req.params;
    const { order } = req.query;
    const { status, body } = api.getRecordingEntry(recording, entryId, order);

    res.status(status);

    if (status === 200) {
      res.json(body);
    } else {
      res.end();
    }
  });

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

  router.post('/:recording', bodyParser.json({ limit: '50mb' }), function(
    req,
    res
  ) {
    const { recording } = req.params;
    const { status, body } = api.saveRecording(recording, req.body);

    res.status(status).send(body);
  });

  router.delete('/:recording', function(req, res) {
    const { recording } = req.params;
    const { status, body } = api.deleteRecording(recording);

    res.status(status).send(body);
  });

  app.use(config.namespace, router);
}
