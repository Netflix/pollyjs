import Persister from '@pollyjs/persister';

const { parse } = JSON;

export default class LocalStoragePersister extends Persister {
  static get name() {
    return 'local-storage';
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
