import Request from './request';
import Response from './response';

const { keys } = Object;

interface Timings {
  [key: string]: number;

  blocked: number;
  dns: number;
  connect: number;
  send: number;
  wait: number;
  receive: number;
  ssl: number;
}

function totalTime(timings = {} as Timings) {
  return keys(timings).reduce(
    (total, k) => (timings[k] > 0 ? (total += timings[k]) : total),
    0
  );
}

export default class Entry {
  public _id: string;
  public _order: string;
  public startedDateTime: string;
  public request: Request;
  public response: Response;
  public cache: {};
  public timings: Timings;
  public time: number;

  constructor(request: PollyRequest) {
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
    } as Timings;
    this.time = totalTime(this.timings);
  }
}
