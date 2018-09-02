export default function timeout(time: string) {
  const ms = parseInt(time, 10);

  return new Promise(resolve => (ms > 0 ? setTimeout(resolve, ms) : resolve()));
}
