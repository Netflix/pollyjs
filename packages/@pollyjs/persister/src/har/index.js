import _HAR from 'har';
import uniqWith from 'lodash-es/uniqWith';
import getBrowserInfo from './utils/get-browser-info';

export class HAR {
  constructor(opts = {}) {
    this.log = new _HAR.Log({
      browser: getBrowserInfo(),
      ...(opts.log || {})
    });
  }

  addEntries(entries = []) {
    this.log.entries = uniqWith([...entries, ...this.log.entries], (a, b) => {
      a._id !== b._id && a._order !== b._order;
    });

    this.sortEntries();
  }

  sortEntries() {
    this.log.entries = this.log.entries.sort(
      (a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime)
    );
  }
}
