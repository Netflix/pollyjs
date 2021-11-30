import Persister from '@pollyjs/persister';

export default class FSPersister extends Persister<{
  recordingsDir?: string;
}> {}
