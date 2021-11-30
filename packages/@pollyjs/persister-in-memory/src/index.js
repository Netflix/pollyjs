import Persister from '@pollyjs/persister';

const store = new Map();

export default class InMemoryPersister extends Persister {
  static get id() {
    return 'in-memory-persister';
  }

  onFindRecording(recordingId) {
    return store.get(recordingId) || null;
  }

  onSaveRecording(recordingId, data) {
    store.set(recordingId, data);
  }

  onDeleteRecording(recordingId) {
    store.delete(recordingId);
  }
}
