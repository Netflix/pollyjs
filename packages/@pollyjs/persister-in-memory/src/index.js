import Persister from '@pollyjs/persister';

const store = new Map();

export default class InMemoryPersister extends Persister {
  static get id() {
    return 'in-memory-persister';
  }

  static get name() {
    // NOTE: deprecated in 4.1.0 but proxying since it's possible "core" is behind
    // and therefore still referencing `name`.  Remove in 5.0.0
    return this.id;
  }

  findRecording(recordingId) {
    return store.get(recordingId) || null;
  }

  saveRecording(recordingId, data) {
    store.set(recordingId, data);
  }

  deleteRecording(recordingId) {
    store.delete(recordingId);
  }
}
