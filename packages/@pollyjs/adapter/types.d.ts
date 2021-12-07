import { Polly, Request, Interceptor, Response } from '@pollyjs/core';

export default class Adapter<
  TOptions extends {} = {},
  TRequest extends Request = Request
> {
  static readonly id: string;
  static readonly type: string;
  constructor(polly: Polly);
  polly: Polly;
  isConnected: boolean;
  readonly defaultOptions: TOptions;
  readonly options: TOptions;
  persister: Polly['persister'];
  connect(): void;
  onConnect(): void;
  disconnect(): void;
  onDisconnect(): void;
  private timeout(request: TRequest, options: { time: number }): Promise<void>;
  handleRequest(
    request: Pick<
      TRequest,
      'url' | 'method' | 'headers' | 'body' | 'requestArguments'
    >
  ): Promise<TRequest>;
  private passthrough(request: TRequest): Promise<void>;
  onPassthrough(request: TRequest): Promise<void>;
  private intercept(request: TRequest, interceptor: Interceptor): Promise<void>;
  onIntercept(request: TRequest, interceptor: Interceptor): Promise<void>;
  private record(request: TRequest): Promise<void>;
  onRecord(request: TRequest): Promise<void>;
  private replay(request: TRequest): Promise<void>;
  onReplay(request: TRequest): Promise<void>;
  assert(message: string, condition?: boolean): void;
  onFetchResponse(
    pollyRequest: TRequest
  ): Promise<Pick<Response, 'statusCode' | 'headers' | 'body' | 'encoding'>>;
  onRespond(request: TRequest, error?: Error): Promise<void>;
  onIdentifyRequest(request: TRequest): Promise<void>;
  onRequest(request: TRequest): Promise<void>;
  onRequestFinished(request: TRequest): Promise<void>;
  onRequestFailed(request: TRequest): Promise<void>;
}
