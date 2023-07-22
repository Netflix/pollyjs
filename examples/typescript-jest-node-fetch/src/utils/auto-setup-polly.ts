import path from "path";
import { setupPolly } from "setup-polly-jest";
import { Polly, PollyConfig } from "@pollyjs/core";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

let recordIfMissing = true;
let mode: PollyConfig['mode'] = 'replay';

switch (process.env.POLLY_MODE) {
  case 'record':
    mode = 'record';
    break;
  case 'replay':
    mode = 'replay';
    break;
  case 'offline':
    mode = 'replay';
    recordIfMissing = false;
    break;
}

/**
 * 
 * ### Example: Ignoring headers (API Keys)
 * 
 * ```ts
 * import autoSetupPolly from '../utils/auto-setup-polly';
 * 
 * describe('Group of tests', () => {
 *   const polly = autoSetupPolly({
 *     matchRequestsBy: {
 *       headers: { exclude: ['x-request-id', 'x-api-key'] },
 *     }
 *   });
 *   
 *   it('Api Request', async () => {
 *     // Polly will skip matching on the headers `x-request-id` and `x-api-key` in requests,
 *     //   AND prevent the values being recorded!
 *     // ... test goes here ...
 *   })
 * });
 * ```
 * 
 * ### Example: Ignoring generated data using a callback
 * 
 * ```ts
 * 
 * import autoSetupPolly from '../utils/auto-setup-polly';
 * 
 * const polly = autoSetupPolly({
 *  matchRequestsBy: {
 *    body(body, req) {
 *      const json = JSON.parse(body);
 *
 *      delete json.uuid;
 *      delete json.createdDate;
 * 
 *      return JSON.stringify(json);
 *    }
 * });
 *
 * ```
 * 
 * @param overrideConfig 
 * @returns 
 */
export default function autoSetupPolly(overrideConfig: PollyConfig = {}) {
  /*
   * This persister can be adapted for both Node.js and Browser environments.
   */
  return setupPolly({
    // 🟡 Note: In node, most `fetch` like libraries use the http/https modules.
    // `node-fetch` is handled by `NodeHttpAdapter`, NOT the `FetchAdapter`.
    adapters: ["node-http"],
    mode,
    recordIfMissing,
    flushRequestsOnStop: true,
    logLevel: "warn",
    recordFailedRequests: true,
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../../__recordings__"),
      },
    },
    ...overrideConfig,
  });
}
