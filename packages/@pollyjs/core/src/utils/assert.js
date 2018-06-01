export default function(msg, condition) {
  if (typeof condition === 'undefined' || condition === false) {
    throw new Error(`[Polly] ${msg}`);
  }
}
