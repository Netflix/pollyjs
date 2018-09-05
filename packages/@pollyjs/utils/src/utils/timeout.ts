export default function timeout(time: number | string): Promise<void> {
  const ms = parseInt(time as string, 10);

  return new Promise(resolve => (ms > 0 ? setTimeout(resolve, ms) : resolve()));
}
