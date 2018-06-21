import uniqWith from 'lodash-es/uniqWith';

export class PollyHAR {
  constructor(polly) {
    this.log = new HAR.Log({
      creator: {
        name: 'Polly.JS',
        version: polly.VERSION
      },
      _pollyjs_meta: {}
    });
  }

  addEntries(entries = []) {
    this.log.entries = uniqWith([...entries, ...this.log.entries], (a, b) => {
      a._pollyjs_meta.id !== b._pollyjs_meta.id &&
        a._pollyjs_meta.order !== b._pollyjs_meta.order;
    });

    this.sortEntries();
  }

  sortEntries() {
    this.log.entries = this.log.entries.sort(
      (a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime)
    );
  }
}
