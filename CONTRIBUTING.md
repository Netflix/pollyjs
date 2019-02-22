# Contributing

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Getting Started

Install required global dependencies:

```bash
npm install -g yarn
```

Check out the code and go into the pollyjs directory:

```bash
git clone https://github.com/netflix/pollyjs.git
cd pollyjs
```

Install the dependencies and bootstrap the monorepo:

```bash
yarn
```

The code for individual packages of this monorepo are in `packages/@pollyjs/*`.
Within any of the packages in this monorepo you'll generally use the npm
package scripts to manage the project, E.g. `yarn run test` or
`yarn run lint`. Run `yarn run` for a list of available commands.

## Running Tests

To run the test suite, from the root directory run:

```bash
yarn test
```

This will bootstrap & build the packages, stand up the node test server, and
instantiate testem. Once running, the test suite will be rerun when any changes
are made to the src or test files.

## Running Docs

All the documentation can be found in the root level `docs` directory. Running
the following command will stand up the docs server which will watch for
changes.

```bash
yarn docs:serve
```

## Conventional Commits

Lerna depends on the use of the [Conventional Commits Specification](https://conventionalcommits.org/)
to determine the version bump and generate CHANGELOG.md files. Make sure your
commits and the title of your PRs follow the spec. A pre-commit hook and CI test
have been added to further enforce this requirement.

## Tips for Getting Your Pull Request Accepted

1. Make sure all new features are tested and the tests pass.
2. Bug fixes must include a test case demonstrating the error that it fixes.
3. Open an issue first and seek advice for your change before submitting
   a pull request. Large features which have never been discussed are
   unlikely to be accepted. **You have been warned.**
