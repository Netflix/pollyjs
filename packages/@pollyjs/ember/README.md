# polly-ember

```js
import { Polly } from '@pollyjs/core';

test('it works', async function(assert) {
  let polly = new Polly('puppy-breeds');
  let res = await fetch('https://dog.ceo/api/breeds/list/all');
  let json = await res.json();
  assert.equal(res.status, 200);
  assert.equal(json.status, 'success');
  polly.stop();
});
```

## Installation

* `git clone <repository-url>` this repository
* `cd polly-ember`
* `yarn install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
