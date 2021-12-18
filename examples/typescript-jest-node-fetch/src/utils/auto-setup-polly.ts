import path from "path";
import { setupPolly } from "setup-polly-jest";
import { Polly } from "@pollyjs/core";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";
// import FetchAdapter from "@pollyjs/adapter-fetch";
// Polly.register(FetchAdapter);
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

const {POLLY_MODE} = process.env;

let recordIfMissing = true;
if (POLLY_MODE === "offline") recordIfMissing = false;

const pollyMode = POLLY_MODE === "record" ? "record"
                : POLLY_MODE === "offline" ? "replay"
                : "replay"; // Default is "replay"

export default function autoSetupPolly() {
  /**
   * NOTE: Customize your config here, usually differs per project.
   * 
   * This persister can be adapted for both Node.js and Browser environments.
   */
  return setupPolly({
    // 🟡 Note: In node, all `fetch` like libraries use the http/https modules under the hood.
    // `node-fetch` is handled by the `NodeHttpAdapter`, NOT the `FetchAdapter`.
    adapters: ["node-http"],
    mode: pollyMode,
    recordIfMissing,
    recordFailedRequests: true,
    flushRequestsOnStop: true,
    logging: false,
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../../__recordings__"),
      },
    },
  });
}

/*
If you have trouble initializing/loading the interceptors early enough, try a singleton pattern for this module:

1. Remove the `export default` here: `export default function autoSetupPolly() {:`
2. Add a new line: `export default autoSetupPolly();`

Then when you `import` this module it will execute roughly immediately, and the default export will be the Context.
*/