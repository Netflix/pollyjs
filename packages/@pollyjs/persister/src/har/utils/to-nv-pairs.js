const { keys } = Object;

export default function toNVPairs(o) {
  return keys(o || {}).map(name => ({ name, value: o[name] }));
}
