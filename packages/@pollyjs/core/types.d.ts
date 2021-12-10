import Adapter from '@pollyjs/adapter';
import Persister from '@pollyjs/persister';
import { Logger, LogLevelDesc } from 'loglevel';

type Newable<T> = { new (...args: any[]): T };

export type MODE = 'record' | 'replay' | 'passthrough' | 'stopped';
export type ACTION = 'record' | 'replay' | 'intercept' | 'passthrough';
export type EXPIRY_STRATEGY = 'record' | 'warn' | 'error';

export const Timing: {
  fixed(ms: number): () => Promise<void>;
  relative(ratio: number): (ms: number) => Promise<void>;
};

export type MatchBy<T = string, R = T> = (input: T, req: Request) => R;
export type Headers = Record<string, string | string[]>;
export interface PollyConfig {
  mode?: MODE | undefined;

  adapters?: Array<string | Newable<Adapter>> | undefined;
  adapterOptions?:
    | {
        fetch?: { context?: any } | undefined;
        puppeteer?:
          | { page?: any; requestResourceTypes?: string[] | undefined }
          | undefined;
        xhr?: { context?: any } | undefined;
        [key: string]: any;
      }
    | undefined;

  persister?: string | Newable<Persister> | undefined;
  persisterOptions?:
    | {
        keepUnusedRequests?: boolean | undefined;
        disableSortingHarEntries?: boolean | undefined;
        fs?: { recordingsDir?: string | undefined } | undefined;
        'local-storage'?:
          | { context?: any; key?: string | undefined }
          | undefined;
        rest?:
          | { host?: string | undefined; apiNamespace?: string | undefined }
          | undefined;
        [key: string]: any;
      }
    | undefined;

  logLevel?: LogLevelDesc | undefined;
  flushRequestsOnStop?: boolean | undefined;

  recordIfMissing?: boolean | undefined;
  recordFailedRequests?: boolean | undefined;
  expiryStrategy?: EXPIRY_STRATEGY | undefined;

  expiresIn?: string | null | undefined;
  timing?: ((ms: number) => Promise<void>) | (() => Promise<void>) | undefined;

  matchRequestsBy?:
    | {
        method?: boolean | MatchBy | undefined;
        headers?:
          | boolean
          | { exclude: string[] }
          | MatchBy<Headers>
          | undefined;
        body?: boolean | MatchBy<any> | undefined;
        order?: boolean | undefined;

        url?:
          | boolean
          | MatchBy
          | {
              protocol?: boolean | MatchBy | undefined;
              username?: boolean | MatchBy | undefined;
              password?: boolean | MatchBy | undefined;
              hostname?: boolean | MatchBy | undefined;
              port?: boolean | MatchBy<number> | undefined;
              pathname?: boolean | MatchBy | undefined;
              query?: boolean | MatchBy<{ [key: string]: any }> | undefined;
              hash?: boolean | MatchBy | undefined;
            }
          | undefined;
      }
    | undefined;
}
export interface HTTPBase {
  headers: Headers;
  body?: string;

  getHeader(name: string): string | string[] | null;
  setHeader(name: string, value?: string | string[] | null): this;
  setHeaders(headers: Headers): this;
  removeHeader(name: string): this;
  removeHeaders(headers: string[]): this;
  hasHeader(name: string): boolean;
  type(contentType: string): this;
  send(body: any): this;
  json(body: any): this;
  jsonBody(): any;
}

export type RequestEvent = 'identify';
export type RequestArguments = { [key: string]: any };

export interface Request<TArguments extends RequestArguments = {}>
  extends HTTPBase {
  method: string;
  url: string;
  readonly absoluteUrl: string;
  readonly protocol: string;
  readonly hostname: string;
  readonly port: string;
  readonly pathname: string;
  hash: string;
  query: { [key: string]: string | string[] };
  readonly params: { [key: string]: string };
  readonly log: Logger;
  readonly requestArguments: TArguments;
  recordingName: string;
  recordingId: string;
  responseTime?: number | undefined;
  timestamp?: string | undefined;
  didRespond: boolean;
  id?: string | undefined;
  order?: number | undefined;
  action: ACTION | null;
  aborted: boolean;
  promise: Promise<void>;
  response?: Response;
  configure(config: Partial<PollyConfig>): void;
  overrideRecordingName(recordingName: string): void;
  on(event: RequestEvent, listener: RequestEventListener): this;
  once(event: RequestEvent, listener: RequestEventListener): this;
  off(event: RequestEvent, listener?: RequestEventListener): this;
}
export interface Response extends HTTPBase {
  statusCode: number;
  encoding: string | undefined;
  readonly statusText: string;
  readonly ok: boolean;

  status(status: number): this;
  sendStatus(status: number): this;
  end(): Readonly<this>;
}

export type RequestRouteEvent = 'request';
export type RecordingRouteEvent = 'beforeReplay' | 'beforePersist';
export type ResponseRouteEvent = 'beforeResponse' | 'response';
export type ErrorRouteEvent = 'error';
export type AbortRouteEvent = 'abort';

export interface ListenerEvent {
  readonly type: string;
  stopPropagation: () => void;
}
export interface Interceptor extends ListenerEvent {
  abort(): void;
  passthrough(): void;
}
export type ErrorEventListener = (
  req: Request,
  error: any,
  event: ListenerEvent
) => void | Promise<void>;
export type AbortEventListener = (
  req: Request,
  event: ListenerEvent
) => void | Promise<void>;
export type RequestEventListener = (
  req: Request,
  event: ListenerEvent
) => void | Promise<void>;
export type RecordingEventListener = (
  req: Request,
  recording: any,
  event: ListenerEvent
) => void | Promise<void>;
export type ResponseEventListener = (
  req: Request,
  res: Response,
  event: ListenerEvent
) => void | Promise<void>;
export type InterceptHandler = (
  req: Request,
  res: Response,
  interceptor: Interceptor
) => void | Promise<void>;
export class RouteHandler {
  on(event: RequestRouteEvent, listener: RequestEventListener): RouteHandler;
  on(
    event: RecordingRouteEvent,
    listener: RecordingEventListener
  ): RouteHandler;
  on(event: ResponseRouteEvent, listener: ResponseEventListener): RouteHandler;
  on(event: ErrorRouteEvent, listener: ErrorEventListener): RouteHandler;
  on(event: AbortRouteEvent, listener: AbortEventListener): RouteHandler;
  off(event: RequestRouteEvent, listener?: RequestEventListener): RouteHandler;
  off(
    event: RecordingRouteEvent,
    listener?: RecordingEventListener
  ): RouteHandler;
  off(
    event: ResponseRouteEvent,
    listener?: ResponseEventListener
  ): RouteHandler;
  off(event: ErrorRouteEvent, listener?: ErrorEventListener): RouteHandler;
  off(event: AbortRouteEvent, listener?: AbortEventListener): RouteHandler;
  once(event: RequestRouteEvent, listener: RequestEventListener): RouteHandler;
  once(
    event: RecordingRouteEvent,
    listener: RecordingEventListener
  ): RouteHandler;
  once(
    event: ResponseRouteEvent,
    listener: ResponseEventListener
  ): RouteHandler;
  once(event: ErrorRouteEvent, listener: ErrorEventListener): RouteHandler;
  once(event: AbortRouteEvent, listener: AbortEventListener): RouteHandler;
  filter: (callback: (req: Request) => boolean) => RouteHandler;
  passthrough(value?: boolean): RouteHandler;
  intercept(fn: InterceptHandler): RouteHandler;
  recordingName(recordingName?: string): RouteHandler;
  configure(config: Partial<PollyConfig>): RouteHandler;
  times(n?: number): RouteHandler;
}
export class PollyServer {
  timeout(ms: number): Promise<void>;
  get(routes?: string | string[]): RouteHandler;
  put(routes?: string | string[]): RouteHandler;
  post(routes?: string | string[]): RouteHandler;
  delete(routes?: string | string[]): RouteHandler;
  patch(routes?: string | string[]): RouteHandler;
  head(routes?: string | string[]): RouteHandler;
  options(routes?: string | string[]): RouteHandler;
  merge(routes?: string | string[]): RouteHandler;
  any(routes?: string | string[]): RouteHandler;
  host(host: string, callback: () => void): void;
  namespace(path: string, callback: () => void): void;
}
export class PollyLogger {
  polly: Polly;
  log: Logger;
  connect(): void;
  disconnect(): void;
  logRequest(request: Request): void;
  logRequestResponse(request: Request, response: Response): void;
  logRequestError(request: Request, error: Error): void;
}
export type PollyEvent = 'create' | 'stop' | 'register';
export type PollyEventListener = (poll: Polly) => void;
export class Polly {
  static register<T extends Adapter | Persister>(Factory: Newable<T>): void;
  static unregister<T extends Adapter | Persister>(Factory: Newable<T>): void;
  static on(event: PollyEvent, listener: PollyEventListener): void;
  static off(event: PollyEvent, listener: PollyEventListener): void;
  static once(event: PollyEvent, listener: PollyEventListener): void;

  constructor(recordingName: string, options?: PollyConfig);

  static VERSION: string;
  recordingName: string;
  recordingId: string;
  mode: MODE;
  server: PollyServer;
  persister: Persister | null;
  adapters: Map<string, Adapter>;
  config: PollyConfig;
  logger: PollyLogger;

  private _requests: Request[];

  pause(): void;
  play(): void;
  replay(): void;
  record(): void;
  passthrough(): void;
  stop(): Promise<void>;
  flush(): Promise<void>;
  configure(config: Partial<PollyConfig>): void;
  connectTo(name: string | typeof Adapter): void;
  disconnectFrom(name: string | typeof Adapter): void;
  disconnect(): void;
}

export const setupMocha: {
  (config?: PollyConfig, context?: any): void;
  beforeEach: (config?: PollyConfig, context?: any) => void;
  afterEach: (context?: any) => void;
};

export const setupQunit: {
  (hooks: any, config?: PollyConfig): void;
  beforeEach: (hooks: any, config?: PollyConfig) => void;
  afterEach: (hooks: any) => void;
};
