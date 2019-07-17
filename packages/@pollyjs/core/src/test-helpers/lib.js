import { PollyError } from '@pollyjs/utils';

import Polly from '../polly';

const { defineProperty } = Object;

export function beforeEach(context, recordingName, defaults) {
  defineProperty(context, 'polly', {
    writable: true,
    enumerable: true,
    configurable: true,
    value: new Polly(recordingName, defaults)
  });
}

export async function afterEach(context, framework) {
  await context.polly.stop();

  defineProperty(context, 'polly', {
    enumerable: true,
    configurable: true,
    get() {
      throw new PollyError(
        `You are trying to access an instance of Polly that is no longer available.\n` +
          `See: https://netflix.github.io/pollyjs/#/test-frameworks/${framework}?id=test-hook-ordering`
      );
    }
  });
}
