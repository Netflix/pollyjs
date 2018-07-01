import Log from './log';

export default class HAR {
  constructor(opts = {}) {
    this.log = new Log(opts.log);
  }
}
