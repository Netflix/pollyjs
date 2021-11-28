import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';

export interface Config {
  port: number;
  quiet: boolean;
  recordingSizeLimit: string;
  recordingsDir: string;
  apiNamespace: string;
}

export interface ServerConfig extends Config {
  corsOptions?: cors.CorsOptions | undefined;
}

export const Defaults: Config;

export interface APIResponse {
  status: number;
  body?: any;
}

export class API {
  constructor(options: Pick<Config, 'recordingsDir'>);
  getRecordings(recording: string): APIResponse;
  saveRecording(recording: string, data: any): APIResponse;
  deleteRecording(recording: string): APIResponse;
  filenameFor(recording: string): string;
  respond(status: number, data?: any): APIResponse;
}

export class Server {
  config: ServerConfig;
  app: express.Express;
  server?: http.Server | undefined;

  constructor(options?: Partial<ServerConfig>);
  listen(port?: number, host?: string): http.Server;
}

export function registerExpressAPI(
  app: express.Express,
  config: Partial<Config>
): void;
