import Persister from '@pollyjs/persister';

const store = new Map();

export default class InMemoryPersister extends Persister {
  static get id() {
    return 'in-memory-persister';
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
