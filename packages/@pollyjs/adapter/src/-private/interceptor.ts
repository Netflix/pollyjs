const ABORT = Symbol();
const PASSTHROUGH = Symbol();

function setDefaults(interceptor: Interceptor) {
  interceptor[ABORT] = false;
  interceptor[PASSTHROUGH] = false;
}

export default class Interceptor {
  [ABORT]: boolean;
  [PASSTHROUGH]: boolean;

  constructor() {
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
