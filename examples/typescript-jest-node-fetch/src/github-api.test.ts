/** @jest-environment setup-polly-jest/jest-environment-node */
import autoSetupPolly from "./utils/auto-setup-polly";
import { getUser } from "./github-api";

// 🟡 Important: Run `autoSetupPolly()`/`setupPolly()` EARLY!
let pollyContext = autoSetupPolly();
/* Polly/Nock MUST patch HTTP modules before your code `import`'s or `require`'s those modules.
✅ Place autoSetupPolly() after `import`'s, OR at the top of first `describe()`.
❌ Do NOT autoSetupPolly() in `beforeAll`/`beforeEach`!
*/

// beforeEach(() => {
//   // Common or shared interceptors go here, or in tests. See example below.
//   pollyContext.polly.server
//       .get("/ping")
//       .intercept((req, res) => void res.sendStatus(200));
// });

test("getUser", async () => {
  const user: any = await getUser("netflix");
  expect(typeof user).toBe("object");
  expect(user?.login).toBe("Netflix");
});

test("getUser: custom interceptor", async () => {
  expect.assertions(1);
  pollyContext.polly.server
    .get("https://api.github.com/users/failing_request_trigger")
    .intercept((req, res) => void res.sendStatus(500));

  await expect(getUser("failing_request_trigger")).rejects.toThrow('Http Error: 500');
});
