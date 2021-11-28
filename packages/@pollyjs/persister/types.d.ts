export default class Persister {
  static readonly id: string;
  static readonly type: string;
  readonly options: { [key: string]: any };
  persist(): Promise<void>;
}
