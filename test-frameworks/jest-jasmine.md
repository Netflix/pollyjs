# Jest & Jasmine

Due to the nature of the Jest & Jasmine APIs and their restrictions on accessing
the current running test and its parent modules, we've decided to keep this test helper
as a 3rd party library provided by [@gribnoysup](https://github.com/gribnoysup).

The [setup-polly-jest](https://github.com/gribnoysup/setup-polly-jest) package provides a `setupPolly` utility which will setup a new polly instance for each test as well as stop it once the test has ended.
The Polly instance's recording name is derived from the current test name as well as its
parent module(s).

[README.md](https://raw.githubusercontent.com/gribnoysup/setup-polly-jest/master/README.md ':include :type=markdown')
