import Event from './event';

const ABORT = Symbol();
const PASSTHROUGH = Symbol();

function setDefaults(interceptor) {
  interceptor[ABORT] = false;
  interceptor[PASSTHROUGH] = false;
}

export default class Interceptor extends Event {
  constructor() {
    super('intercept');
    setDefaults(this);
  }

  abort() {
    setDefaults(this);
    this[ABORT] = true;
  }

  passthrough() {
    setDefaults(this);
    this[PASSTHROUGH] = true;
  }

  get shouldAbort() {
    return this[ABORT];
  }

  get shouldPassthrough() {
    return this[PASSTHROUGH];
  }

  get shouldIntercept() {
    return !this.shouldAbort && !this.shouldPassthrough;
  }
}
