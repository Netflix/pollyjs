import isObjectLike from 'lodash-es/isObjectLike';
import { assert } from '@pollyjs/utils';

export function validateRecordingName(name) {
  assert(
    `Invalid recording name provided. Expected string, received: "${typeof name}".`,
    typeof name === 'string'
  );

  assert(
    `Invalid recording name provided. Received An empty or blank string.`,
    name.trim().length > 0
  );
}

export function validateRequestConfig(config) {
  assert(
    `Invalid config provided. Expected object, received: "${typeof config}".`,
    isObjectLike(config) && !Array.isArray(config)
  );

  // The following options cannot be overridden on a per request basis
  [
    'mode',
    'adapters',
    'adapterOptions',
    'persister',
    'persisterOptions'
  ].forEach(key =>
    assert(
      `Invalid configuration option provided. The "${key}" option cannot be overridden using the server configuration API.`,
      !(key in config)
    )
  );
}

export function validateTimesOption(times) {
  assert(
    `Invalid number provided. Expected number, received: "${typeof times}".`,
    typeof times === 'number'
  );

  assert(
    `Invalid number provided. The number must be greater than 0, received "${typeof times}".`,
    times > 0
  );
}
