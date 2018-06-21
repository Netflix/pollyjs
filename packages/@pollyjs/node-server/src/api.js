import fs from 'fs-extra';
import path from 'path';

export default class API {
  constructor(recordingsDir) {
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
    fs.outputJsonSync(this.filenameFor(recording), data, {
      spaces: 2
    });

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
    return path.join(this.recordingsDir, recording, 'recording.json');
  }

  respond(status, body) {
    return { status, body };
  }
}
