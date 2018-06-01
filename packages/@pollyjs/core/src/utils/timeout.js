export default function timeout(time) {
  const ms = parseInt(time, 10);

  return new Promise(resolve => (ms > 0 ? setTimeout(resolve, ms) : resolve()));
}
