export default function(msg: string, condition: unknown) {
  if (typeof condition === 'undefined' || condition === false) {
    throw new Error(`[Polly] ${msg}`);
  }
}
