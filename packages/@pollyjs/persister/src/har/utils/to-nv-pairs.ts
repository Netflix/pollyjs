const { keys } = Object;

export interface NVPairs extends Array<{
  name: string
  value: any
}> {}

export default function toNVPairs(o: { [key: string]: any }) {
  return keys(o || {}).map(name => ({ name, value: o[name] })) as NVPairs;
}
