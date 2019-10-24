import path from 'path';

import stringify from 'json-stable-stringify';
import fs from 'fs-extra';
import { assert } from '@pollyjs/utils';

export default class API {
  constructor(options = {}) {
    const { recordingsDir } = options;

    assert(
      `Invalid recordings directory provided. Expected string, received: "${typeof recordingsDir}".`,
      typeof recordingsDir === 'string'
    );

    this.recordingsDir = recordingsDir;
  }

  getRecording(recording) {
    const recordingFilename = this.filenameFor(recording);

    if (fs.existsSync(recordingFilename)) {
      return this.respond(200, fs.readJsonSync(recordingFilename));
    }

    return this.respond(204);
  }

  saveRecording(recording, data) {
    fs.outputFileSync(
      this.filenameFor(recording),
      stringify(data, { space: 2 })
    );

    return this.respond(201);
  }

  deleteRecording(recording) {
    const recordingFilename = this.filenameFor(recording);

    if (fs.existsSync(recordingFilename)) {
      fs.removeSync(recordingFilename);
    }

    return this.respond(200);
  }

  filenameFor(recording) {
    return path.join(this.recordingsDir, recording, 'recording.har');
  }

  respond(status, body) {
    return { status, body };
  }
}
