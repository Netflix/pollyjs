import isObjectLike from 'lodash-es/isObjectLike';

const { keys } = Object;

export interface HTTPHeaders {
  [key: string]: string
}

const HANDLER = {
  get(obj: {}, prop: string | symbol): any {
    return obj[typeof prop === 'string' ? prop.toLowerCase() : prop];
  },

  set(obj: {}, prop: string | symbol, value: any): boolean {
    if (typeof prop !== 'string') {
      return false;
    }

    if (!value) {
      delete obj[prop.toLowerCase()];
    } else {
      obj[prop.toLowerCase()] = value;
    }

    return true;
  }
};

export default function HTTPHeaders(headers?: {}): {} {
  const proxy = new Proxy({}, HANDLER);

  if (isObjectLike(headers)) {
    keys(headers).forEach(h => (proxy[h] = headers[h]));
  }

  return proxy;
}
