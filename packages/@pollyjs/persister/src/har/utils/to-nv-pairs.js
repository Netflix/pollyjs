const { keys } = Object;
const { isArray } = Array;

export default function toNVPairs(o) {
  return keys(o || {}).reduce((pairs, name) => {
    const value = o[name];

    if (isArray(value)) {
      pairs.push(...value.map(v => ({ name, value: v })));
    } else {
      pairs.push({ name, value });
    }

    return pairs;
  }, []);
}
