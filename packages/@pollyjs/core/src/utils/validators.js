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
