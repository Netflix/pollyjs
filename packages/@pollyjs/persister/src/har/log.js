import uniqWith from 'lodash-es/uniqWith';
import bowser from 'bowser';

const browser =
  bowser && bowser.name && bowser.version
    ? { name: bowser.name, version: bowser.version }
    : null;

export default class Log {
  constructor(opts = {}) {
    // eslint-disable-next-line no-restricted-properties
    Object.assign(
      this,
      {
        version: '1.2',
        entries: [],
        pages: []
      },
      opts
    );

    if (!this.browser && browser) {
      this.browser = browser;
    }
  }

  addEntries(entries = []) {
    this.entries = uniqWith(
      // Add the new entries to the front so they take priority
      [...entries, ...this.entries],
      (a, b) => a._id === b._id && a._order === b._order
    );

    this.sortEntries();
  }

  sortEntries() {
    this.entries = this.entries.sort(
      (a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime)
    );
  }
}
