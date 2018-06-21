import Persister from '@pollyjs/persister';
import stringify from 'json-stable-stringify';

export default class LocalStoragePersister extends Persister {
  constructor(polly, store = self.localStorage) {
    super(polly);
    this._store = store;
    this._namespace = '__pollyjs__';
  }

  get db() {
    const items = this._store.getItem(this._namespace);

    return items ? JSON.parse(items) : {};
  }

  set db(db) {
    this._store.setItem(this._namespace, stringify(db));
  }

  findRecording(recordingId) {
    return this.db[recordingId] || null;
  }

  saveRecording(recordingId, data) {
    const { db } = this;

    db[recordingId] = data;
    this.db = db;
  }

  deleteRecording(recordingId) {
    const { db } = this;

    delete db[recordingId];
    this.db = db;
  }
}
