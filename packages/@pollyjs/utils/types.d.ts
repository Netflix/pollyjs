export enum MODES {
  RECORD = 'record',
  REPLAY = 'replay',
  PASSTHROUGH = 'passthrough',
  STOPPED = 'stopped'
}

export enum ACTIONS {
  RECORD = 'record',
  REPLAY = 'replay',
  INTERCEPT = 'intercept',
  PASSTHROUGH = 'passthrough'
}

export enum EXPIRY_STRATEGIES {
  RECORD = 'record',
  WARN = 'warn',
  ERROR = 'error'
}
