export default class PollyError extends Error {
  constructor(message, ...args) {
    super(`[Polly] ${message}`, ...args);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PollyError);
    }

    this.name = 'PollyError';
  }
}
