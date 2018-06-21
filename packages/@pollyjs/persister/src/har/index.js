import uniqWith from 'lodash-es/uniqWith';
import getBrowserInfo from './utils/get-browser-info';

const { keys, values } = Object;

function toNameValue(o) {
  return keys(o || {}).map(name => ({ name, value: o[name] }));
}

class Log {
  constructor(props = {}) {
    // eslint-disable-next-line no-restricted-properties
    Object.assign(
      this,
      {
        version: '1.2',
        creator: {},
        browser: getBrowserInfo(),
        pages: [],
        entries: []
      },
      props
    );

    this.sortEntries();
  }

  addEntries(entries = []) {
    this.entries = uniqWith([...entries, ...this.entries], (a, b) => {
      a._pollyjs_meta.id !== b._pollyjs_meta.id &&
        a._pollyjs_meta.order !== b._pollyjs_meta.order;
    });

    this.sortEntries();
  }

  sortEntries() {
    const { entries } = this;

    this.entries = entries.sort(
      (a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime)
    );
  }
}

export class Entry {
  constructor(request) {
    this.startedDateTime = request.timestamp;
    this.request = this._request(request);
    this.response = this._response(request.response);
    this.timings = this._timings(request);
    this.time = this._time(this.timings);
    this._pollyjs_meta = {
      id: request.id,
      order: request.order
    };
  }

  _request(request) {
    const harReq = {
      method: request.method,
      url: request.url,
      httpVersion: 'HTTP/1.1',
      cookies: [],
      headers: toNameValue(request.headers),
      queryString: toNameValue(request.query),
      headersSize: -1,
      bodySize: -1
    };

    if (request.body) {
      harReq.postData = {
        mimeType: 'text/plain',
        text: request.serializeBody
      };
    }

    return harReq;
  }

  _response(response) {
    const harRes = {
      status: response.statusCode,
      statusText: response.statusText,
      httpVersion: 'HTTP/1.1',
      cookies: [],
      headers: toNameValue(response.headers),
      content: {},
      redirectURL: '',
      headersSize: -1,
      bodySize: -1
    };

    if (response.body) {
      harRes.content = {
        mimeType: response.getHeader('Content-Type'),
        text: response.body
      };
    }

    return harRes;
  }

  _timings(request) {
    return {
      blocked: -1,
      dns: -1,
      connect: -1,
      send: 0,
      wait: request.responseTime,
      receive: 0,
      ssl: -1
    };
  }

  _time(timings) {
    return values(timings).reduce((accum, time) => {
      if (time > 0) {
        accum += time;
      }

      return accum;
    }, 0);
  }
}

export default { Log, Entry };
