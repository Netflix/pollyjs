import Persister from '@pollyjs/persister';

export default class LocalStoragePersister extends Persister<{
  context?: any;
  key?: string;
}> {}
