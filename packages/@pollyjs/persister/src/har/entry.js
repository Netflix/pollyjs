import HARRequest from './request';
import HARResponse from './response';

export default class Entry {
  constructor(request) {
    this._id = request.id;
    this._order = request.order;
    this.startedDateTime = request.timestamp;
    this.time = request.responseTime;
    this.request = new HARRequest(request);
    this.response = new HARResponse(request.response);
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
  }
}
