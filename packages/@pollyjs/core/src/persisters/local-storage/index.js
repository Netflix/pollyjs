import Persister from '@pollyjs/persister';
import get from 'lodash-es/get';
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

  findRecordingEntry(pollyRequest) {
    const { id, order, recordingId } = pollyRequest;
    const entries = get(this.db, `${recordingId}.entries.${id}`) || [];

    return entries[order] || null;
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
