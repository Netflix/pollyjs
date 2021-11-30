import { Polly, Headers, Request, Interceptor } from '@pollyjs/core';

export default class Adapter<
  TOptions extends {} = {},
  TRequestArguments = any
> {
  static readonly id: string;
  static readonly type: string;
  polly: Polly;
  isConnected: boolean;
  readonly defaultOptions: TOptions;
  readonly options: TOptions;
  persister: Polly['persister'];
  connect: () => void;
  onConnect: () => void;
  disconnect: () => void;
  onDisconnect: () => void;
  timeout: (request: Request, options: { time: number }) => Promise<void>;
  handleRequest: (request: {
    url: string;
    method: string;
    headers: Headers;
    body: string;
    requestArguments?: TRequestArguments;
  }) => Promise<Request>;
  passthrough: (request: Request) => Promise<void>;
  onIntercept: (request: Request, interceptor: Interceptor) => Promise<void>;
  intercept: (request: Request, interceptor: Interceptor) => Promise<void>;
  onRecord: (request: Request) => Promise<void>;
  record: (request: Request) => Promise<void>;
  onReplay: (request: Request) => Promise<void>;
  replay: (request: Request) => Promise<void>;
  assert: (message: string, condition?: boolean) => void;
  onPassthrough: (request: Request) => Promise<void>;
  passthroughRequest(pollyRequest: Request): Promise<{
    statusCode: number;
    headers: Headers;
    body: string;
    encoding?: string;
  }>;
  respondToRequest: (request: Request, error?: Error) => Promise<void>;
  onIdentifyRequest: (request: Request) => Promise<void>;
  onRequest: (request: Request) => Promise<void>;
  onRequestFinished: (request: Request) => Promise<void>;
  onRequestFailed: (request: Request) => Promise<void>;
}
