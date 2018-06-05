# Commands

As of right now, the Polly CLI only knows one command but expect to see more
in the near future!

## listen

Start up a node server and listen for Polly requests via the
[REST Persister](persisters/rest) to be able to record and replay recordings
to and from disk.

### Usage

```text
  Usage: polly listen|l [options]

  start the server and listen for requests

  Options:

    -H, --host <host>                host
    -p, --port <port>                port number (default: 3000)
    -n, --api-namespace <namespace>  api namespace (default: polly)
    -d, --recordings-dir <path>      recordings directory (default: recordings)
    -q, --quiet                      disable the logging
    -h, --help                       output usage information
```
