export default function isObject(o) {
  return o !== undefined && o !== null && typeof o === 'object';
}
