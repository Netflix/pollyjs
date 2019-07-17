import PollyError from './polly-error';

export default function(msg, condition) {
  if (!condition) {
    throw new PollyError(msg);
  }
}
