# Custom Persister

If you need to create your own persister or modify an pre-existing one, you've come
to the right page!

## Creating a Custom Persister

The `@pollyjs/persister` package provides an extendable base persister class that
contains core logic dependent on by the [REST](persisters/rest)
& [Local Storage](persisters/local-storage) persisters.

### Installation

_Note that you must have node (and npm) installed._

```bash
npm install @pollyjs/persister -D
```

If you want to install it with [yarn](https://yarnpkg.com):

```bash
yarn add @pollyjs/persister -D
```

### Usage

```js
import Persister from '@pollyjs/persister';

class CustomPersister extends Persister {
  static get id() {
    return 'custom';
  }

  findRecording() {}

  saveRecording() {}

  deleteRecording() {}
}
```

For better usage examples, please refer to the source code for
the [REST](https://github.com/Netflix/pollyjs/blob/master/packages/%40pollyjs/core/src/persisters/rest/index.js) & [Local Storage](https://github.com/Netflix/pollyjs/blob/master/packages/%40pollyjs/core/src/persisters/local-storage/index.js) persisters.

## Extending from an Existing Persister

The `@pollyjs/core` package exports the `RESTPersister` and `LocalStoragePersister` classes,
allowing you to modify them as needed.

```js
import RESTPersister from '@pollyjs/persister-rest';
import LocalStoragePersister from '@pollyjs/persister-local-storage';

class CustomRESTPersister extends RESTPersister {}
class CustomLocalStoragePersister extends LocalStoragePersister {}
```

## Registering & Connecting to a Custom Persister

You can register and connect to a custom persister by passing an array to the `persister`
config where the first element is the name of your persister and the second is the
persister class.

```js
// Register and connect to a custom persister:
new Polly('Custom Persister', {
  persister: MyCustomPersisterClass
});

// Register and connect to a custom persister via .configure():
const polly = new Polly('Custom Persister');

polly.configure({
  persister: MyCustomPersisterClass
});
```
