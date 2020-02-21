import Persister from '@pollyjs/persister';
import { API, Defaults } from '@pollyjs/node-server';

const { parse } = JSON;

export default class FSPersister extends Persister {
  constructor() {
    super(...arguments);
    this.api = new API(this.options);
  }

  static get id() {
    return 'fs';
  }

  static get name() {
    // NOTE: deprecated in 4.1.0 but proxying since it's possible "core" is behind
    // and therefore still referencing `name`.  Remove in 5.0.0
    return this.id;
  }

  get defaultOptions() {
    return {
      recordingsDir: Defaults.recordingsDir
    };
  }

  findRecording(recordingId) {
    return this.api.getRecording(recordingId).body || null;
  }

  saveRecording(recordingId, data) {
    /*
      Pass the data through the base persister's stringify method so
      the output will be consistent with the rest of the persisters.
    */
    this.api.saveRecording(recordingId, parse(this.stringify(data)));
  }

  deleteRecording(recordingId) {
    this.api.deleteRecording(recordingId);
  }
}
