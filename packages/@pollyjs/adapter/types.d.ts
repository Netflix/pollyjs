import { Headers, Request } from '@pollyjs/core';

export default class Adapter {
  static readonly id: string;
  static readonly type: string;
  readonly options: { [key: string]: any };
  connect(): void;
  disconnect(): void;
  passthroughRequest(pollyRequest: Request): Promise<{
    statusCode: number;
    headers: Headers;
    body: string;
  }>;
}
