# Notes

## For Node.js users

In Node.js environments Polly uses `nock` under the hood.

<!-- Nock can be configured using some environment variables: -->

### [**NOCK_BACK_MODE**](https://github.com/nock/nock#modes)

- `lockdown` - use recorded nocks, **disables** all http calls even when not nocked, doesn't record.
- `wild` - all requests go out to the internet, don't replay anything, doesn't record anything.
- `record` - use recorded nocks, record new nocks.
- `update` - remove recorded nocks, record nocks.
- `dryrun` - *default* use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests.
  
Handy scripts for your `package.json`:

```json
{
  "test":         "yarn --coverage --watchAll",
  "test:record":  "NOCK_BACK_MODE=record    yarn test",
  "test:refresh": "NOCK_BACK_MODE=update    yarn test",
  "test:offline": "NOCK_BACK_MODE=lockdown  yarn test",
  "test:live":    "NOCK_BACK_MODE=wild      yarn test",
}

```

### **DEBUG** Environment Variable

- The `DEBUG` variable lets you see plenty of interesting internal details for many popular nodejs libraries.

```json
{
  "test:log-minimal":    "DEBUG=nock.scope          yarn test",
  "test:log-short":      "DEBUG=nock.intercept      yarn test",
  "test:log-data":       "DEBUG=nock.*intercept*    yarn test"
}
```
