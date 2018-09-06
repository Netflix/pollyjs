import uniqWith from 'lodash-es/uniqWith';
import bowser from 'bowser';
import Entry from './entry';

interface Browser {
  name: string;
  version?: string;
}

const browser =
  bowser && bowser.name && bowser.version
    ? { name: bowser.name, version: bowser.version } as Browser
    : null;

export default class Log {
  public version: string;
  public entries: Entry[];
  public pages: [];
  public browser?: Browser
  public creator?: {
    name: string
    version: string
    comment: string
  }
  public _recordingName?: string;

  constructor(opts = {}) {
    this.version = '1.2';
    this.entries = [];
    this.pages = [];

    // eslint-disable-next-line no-restricted-properties
    Object.assign(this, opts);

    if (!this.browser && browser) {
      this.browser = browser;
    }
  }

  public addEntries(entries: Entry[] = []) {
    this.entries = uniqWith(
      // Add the new entries to the front so they take priority
      [...entries, ...this.entries],
      (a, b) => a._id === b._id && a._order === b._order
    );

    this.sortEntries();
  }

  public sortEntries() {
    this.entries = this.entries.sort(
      (a, b) => new Date(a.startedDateTime).getTime() - new Date(b.startedDateTime).getTime()
    );
  }
}
