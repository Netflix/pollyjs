import mergeOptions from 'merge-options';
import XHRAdapter from './adapters/xhr';
import FetchAdapter from './adapters/fetch';
import Logger from './-private/logger';
import Container from './-private/container';
import DefaultConfig from './defaults/config';
import PollyRequest from './-private/request';
import guidForRecording from './utils/guid-for-recording';
import LocalStoragePersister from './persisters/local-storage';
import RestPersister from './persisters/rest';
import Server from './server';
import { version } from '../package.json';
import { MODES, assert } from '@pollyjs/utils';

const RECORDING_NAME = Symbol();
const CLASS_CONFIG = Symbol();
const RECORDING_ID = Symbol();
const PAUSED_MODE = Symbol();
const { isArray } = Array;
const { values } = Object;

/**
 * @export
 * @class Polly
 */
export default class Polly {
  constructor(recordingName, config) {
    this.recordingName = recordingName;
    this.logger = new Logger(this);
    this.server = new Server();
    this.config = {};
    this._container = new Container();

    /* running adapter instances */
    this._adapters = new Map();

    /* requests over the lifetime of the polly instance */
    this._requests = [];

    this.registerDefaultTypes();
    this.configure(config);
    this.logger.connect();
  }

  /**
   * Package version.
   *
   * Gets populated on build time via rollup-plugin-replace
   *
   * @readonly
   * @public
   * @memberof Polly
   */
  get VERSION() {
    return version;
  }

  /**
   * @public
   * @memberof Polly
   */
  get recordingName() {
    return this[RECORDING_NAME];
  }

  set recordingName(name) {
    assert(
      `'${name}' is not a valid recording name.`,
      typeof name === 'string' && name.trim().length > 0
    );

    this[RECORDING_NAME] = name;
    this[RECORDING_ID] = guidForRecording(name);
  }

  /**
   * @readonly
   * @public
   * @memberof Polly
   */
  get recordingId() {
    return this[RECORDING_ID];
  }

  get mode() {
    return this.config.mode;
  }

  set mode(mode) {
    const possibleModes = values(MODES);

    assert(
      `Invalid mode provided: "${mode}". Possible modes: ${possibleModes.join(
        ', '
      )}.`,
      possibleModes.includes(mode)
    );

    this.config.mode = mode;
  }

  /**
   * @param {Object} [config={}]
   * @public
   * @memberof Polly
   */
  configure(config = {}) {
    assert(
      'Cannot call `configure` once requests have been handled.',
      this._requests.length === 0
    );
    assert(
      'Cannot call `configure` on an instance of Polly that is not running.',
      this.mode !== MODES.STOPPED
    );

    const { _container: container } = this;

    this.config = mergeOptions(
      DefaultConfig,
      Polly[CLASS_CONFIG],
      this.config,
      config
    );

    // Handle Adapters
    this.config.adapters.forEach(adapter => {
      let adapterName = adapter;

      if (isArray(adapterName)) {
        const [name, AdapterType] = adapterName;

        adapterName = name;
        container.set(`adapter:${adapterName}`, AdapterType);
      }

      if (typeof adapterName === 'string') {
        this.connectTo(adapterName);

        return;
      }

      assert(
        `Invalid argument "${adapterName}" passed into \`configure({ adapters: [...] })\``,
        false
      );
    });

    // Handle Persister
    let { persister: persisterName } = this.config;

    if (isArray(persisterName)) {
      const [name, PersisterType] = persisterName;

      persisterName = name;
      container.set(`persister:${persisterName}`, PersisterType);
    }

    this.persister = new (container.get(`persister:${persisterName}`))(this);
  }

  /**
   * Do not use `configure` this will be removed in the future in favor of
   * eventing `Polly.on('create', (instance) => {})`
   * @private
   */
  static configure(config) {
    Polly[CLASS_CONFIG] = mergeOptions({}, Polly[CLASS_CONFIG], config);
  }

  /** @private **/
  static clearConfig() {
    Polly[CLASS_CONFIG] = undefined;
  }

  /**
   *
   * @private
   * @memberof Polly
   */
  registerDefaultTypes() {
    this._container.set('adapter:xhr', XHRAdapter);
    this._container.set('adapter:fetch', FetchAdapter);
    this._container.set('persister:rest', RestPersister);
    this._container.set('persister:local-storage', LocalStoragePersister);
  }

  /**
   * @public
   * @memberof Polly
   */
  record() {
    this.mode = MODES.RECORD;
  }

  /**
   * @public
   * @memberof Polly
   */
  replay() {
    this.mode = MODES.REPLAY;
  }

  /**
   * @public
   * @memberof Polly
   */
  pause() {
    this[PAUSED_MODE] = this.mode;
    this.mode = MODES.PASSTHROUGH;
  }

  /**
   * @public
   * @memberof Polly
   */
  play() {
    if (this[PAUSED_MODE]) {
      this.mode = this[PAUSED_MODE];
      delete this[PAUSED_MODE];
    }
  }

  /**
   * @public
   * @memberof Polly
   */
  async stop() {
    if (this.mode !== MODES.STOPPED) {
      this.disconnect();
      this.logger.disconnect();
      await this.persister.persist();
      this.mode = MODES.STOPPED;
    }
  }

  /**
   * @param {String} adapterName
   * @public
   * @memberof Polly
   */
  connectTo(adapterName) {
    assert(
      `Adapter matching the name \`${adapterName}\` was not registered.`,
      this._container.has(`adapter:${adapterName}`)
    );

    if (this._adapters.has(adapterName)) {
      return;
    }

    const AdapterType = this._container.get(`adapter:${adapterName}`);

    /* disconnect from running adapter when registering a new type */
    if (this._container.get(`adapter:${adapterName}`) !== AdapterType) {
      this.disconnectFrom(adapterName);
    }

    const adapter = new AdapterType(this);

    this._adapters.set(adapterName, adapter);
    adapter.connect();
  }

  /**
   * @param {String} adapterName
   * @public
   * @memberof Polly
   */
  disconnectFrom(adapterName) {
    if (!this._adapters.has(adapterName)) {
      return;
    }

    this._adapters.get(adapterName).disconnect();
    this._adapters.delete(adapterName);
  }

  /**
   * @public
   * @memberof Polly
   */
  disconnect() {
    for (const adapterName of this._adapters.keys()) {
      this.disconnectFrom(adapterName);
    }
  }

  /**
   * @param {Object} [request={}]
   * @returns {PollyRequest}
   * @private
   * @memberof Polly
   */
  registerRequest(request = {}) {
    const pollyRequest = new PollyRequest(this, request);

    this._requests.push(pollyRequest);

    return pollyRequest;
  }
}
