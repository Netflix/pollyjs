import { assert } from '@pollyjs/utils';

const SYNC_VALUE = Symbol();

export default function assertSync(message, value) {
  return Promise.race([value, SYNC_VALUE]).then(settled => {
    assert(message, settled === value);
  });
}
