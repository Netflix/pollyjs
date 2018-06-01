import path from 'path';
import fs from 'fs-extra';

export default class API {
  constructor(recordingsDir) {
    this.recordingsDir = recordingsDir;
  }

  getRecordingEntry(recording, entryId, order) {
    const recordingFilename = this.filenameFor(recording);

    if (fs.existsSync(recordingFilename)) {
      const data = fs.readJsonSync(recordingFilename);
      const entries = data.entries[entryId];

      if (entries && entries[order]) {
        return this.respond(200, entries[order]);
      }
    }

    return this.respond(404);
  }

  getRecording(recording) {
    const recordingFilename = this.filenameFor(recording);

    if (fs.existsSync(recordingFilename)) {
      return this.respond(200, fs.readJsonSync(recordingFilename));
    }

    return this.respond(404);
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

    return this.respond(204);
  }

  filenameFor(recording) {
    return path.join(this.recordingsDir, recording, 'recording.json');
  }

  respond(status, body) {
    return { status, body };
  }
}
