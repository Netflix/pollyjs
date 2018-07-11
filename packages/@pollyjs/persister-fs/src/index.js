import Persister from '@pollyjs/persister';
import { API, Defaults } from '@pollyjs/node-server';

const { parse } = JSON;

export default class FSPersister extends Persister {
  constructor() {
    super(...arguments);
    this.api = new API(this.options);
  }

  static get name() {
    return 'fs';
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
