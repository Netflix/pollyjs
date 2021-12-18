import { Polly, Request } from '@pollyjs/core';
import { Cookie } from 'set-cookie-parser';

type NVObject = { name: string; value: string };

export interface HarRequest {
  httpVersion: string;
  url: string;
  method: string;
  headers: NVObject[];
  headersSize: number;
  queryString: NVObject[];
  cookies: Cookie[];
  postData?: {
    mimeType: string;
    params: [];
    text?: string;
  };
  bodySize?: number;
}

export interface HarResponse {
  httpVersion: string;
  status: number;
  statusText: string;
  headers: NVObject[];
  headersSize: number;
  cookies: Cookie[];
  content: {
    mimeType: string;
    text?: string;
    encoding?: string;
    size?: number;
  };
  bodySize?: number;
}

export interface HarEntry {
  _id: string;
  _order: number;
  startedDateTime: string;
  request: HarRequest;
  response: HarResponse;
  cache: {};
  timings: {
    blocked: number;
    dns: number;
    connect: number;
    send: number;
    wait: number;
    receive: number;
    ssl: number;
  };
  time: number;
}

export interface HarLog {
  version: string;
  browser: string;
  entries: HarEntry[];
  pages: [];
  addEntries(entries: HarEntry[]): void;
  sortEntries(): void;
}

export interface Har {
  log: HarLog;
}

export default class Persister<TOptions extends {} = {}> {
  static readonly id: string;
  static readonly type: string;
  constructor(polly: Polly);
  readonly defaultOptions: TOptions;
  readonly options: TOptions;
  private pending: Map<string, { name: string; recordings: Request[] }>;
  private _cache: Map<string, Har>;
  polly: Polly;
  hasPending: boolean;
  persist(): Promise<void>;
  recordRequest(request: Request): void;
  private findRecording(recordingId: string): Promise<Har | null>;
  onFindRecording(recordingId: string): Promise<Har | null>;
  private saveRecording(recordingId: string, har: Har): Promise<void>;
  onSaveRecording(recordingId: string, har: Har): Promise<void>;
  private deleteRecording(recordingId: string): Promise<void>;
  onDeleteRecording(recordingId: string): Promise<void>;
  findEntry(request: Request): Promise<HarEntry | null>;
  stringify(value: any): string;
  assert(message: string, condition?: boolean): void;
}
