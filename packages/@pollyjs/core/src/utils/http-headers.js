import isObjectLike from 'lodash-es/isObjectLike';

const { keys } = Object;
const HANDLER = {
  get(obj, prop) {
    return obj[prop.toLowerCase()];
  },

  set(obj, prop, value) {
    if (!value) {
      delete obj[prop.toLowerCase()];
    } else {
      obj[prop.toLowerCase()] = value;
    }

    return true;
  }
};

export default function HTTPHeaders(headers) {
  const proxy = new Proxy({}, HANDLER);

  if (isObjectLike(headers)) {
    keys(headers).forEach(h => (proxy[h] = headers[h]));
  }

  return proxy;
}
