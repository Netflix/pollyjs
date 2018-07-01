import Request from './request';
import Response from './response';

const { keys } = Object;

function totalTime(timings = {}) {
  return keys(timings).reduce(
    (total, k) => (timings[k] > 0 ? (total += timings[k]) : total),
    0
  );
}

export default class Entry {
  constructor(request) {
    this._id = request.id;
    this._order = request.order;
    this.startedDateTime = request.timestamp;
    this.request = new Request(request);
    this.response = new Response(request.response);
    this.cache = {};
    this.timings = {
      blocked: -1,
      dns: -1,
      connect: -1,
      send: 0,
      wait: request.responseTime,
      receive: 0,
      ssl: -1
    };
    this.time = totalTime(this.timings);
  }
}
