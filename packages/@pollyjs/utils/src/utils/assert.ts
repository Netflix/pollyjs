export default function(msg: string, condition: any) {
  if (typeof condition === 'undefined' || condition === false) {
    throw new Error(`[Polly] ${msg}`);
  }
}
