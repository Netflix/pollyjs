import Persister from '@pollyjs/persister';

export default class RESTPersister extends Persister<{
  host?: string;
  apiNamespace?: string;
}> {}
