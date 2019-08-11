#!/usr/bin/env bash

if [ ! -f "./packages/@pollyjs/node-server/dist/cjs/pollyjs-node-server.js" ]; then
  echo "pollyjs: test server build not found; run either '$ yarn watch' or '$ yarn server:build'"
  exit 1
fi

if [ ! -f "./packages/@pollyjs/core/dist/cjs/pollyjs-core.js" ]; then
  echo "pollyjs: build not found; run either '$ yarn watch' or '$ yarn build'"
  exit 1
fi

if [ ! -f "./packages/@pollyjs/core/build/node/test-bundle.cjs.js" ]; then
  echo "pollyjs: test build not found; run either '$ yarn watch' or '$ yarn test:build'"
  exit 1
fi
