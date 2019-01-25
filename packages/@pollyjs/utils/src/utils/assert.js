export default function(msg, condition) {
  if (!condition) {
    throw new Error(`[Polly] ${msg}`);
  }
}
