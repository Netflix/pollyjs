import Persister from '@pollyjs/persister';

const { parse } = JSON;

export default class LocalStoragePersister extends Persister {
  static get id() {
    return 'local-storage';
  }

  static get name() {
    // NOTE: deprecated in 4.1.0 but proxying since it's possible "core" is behind
    // and therefore still referencing `name`.  Remove in 5.0.0
    return this.id;
  }

  get defaultOptions() {
    return {
      key: 'pollyjs',
      context: global
    };
  }

  get localStorage() {
    const { context } = this.options;

    this.assert(
      `Could not find "localStorage" on the given context "${context}".`,
      context && context.localStorage
    );

    return context.localStorage;
  }

  get db() {
    const items = this.localStorage.getItem(this.options.key);

    return items ? parse(items) : {};
  }

  set db(db) {
    this.localStorage.setItem(this.options.key, this.stringify(db));
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
