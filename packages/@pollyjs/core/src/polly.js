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
import { version } from '../package.json';
import Modes from './defaults/modes';
import assert from './utils/assert';
import Server from './server';

const RECORDING_NAME = Symbol();
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
    this.assert(
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
    const possibleModes = values(Modes);

    this.assert(
      `Invalid mode provided: "${mode}". Possible modes: ${possibleModes.join(
        ', '
      )}.`,
      possibleModes.includes(mode)
    );

    this.config.mode = mode;
  }

  /**
   * @public
   * @readonly
   * @memberof Polly
   */
  get Modes() {
    return Modes;
  }

  /**
   *
   * @private
   * @memberof Polly
   */
  assert() {
    return assert(...arguments);
  }

  /**
   * @param {Object} [config={}]
   * @public
   * @memberof Polly
   */
  configure(config = {}) {
    this.assert(
      'Cannot call `configure` once requests have been handled.',
      this._requests.length === 0
    );
    this.assert(
      'Cannot call `configure` on an instance of Polly that is not running.',
      this.mode !== Modes.STOPPED
    );

    this.config = mergeOptions(DefaultConfig, this.config, config);

    this.config.adapters.forEach(adapterOptions => {
      if (isArray(adapterOptions)) {
        const [adapterName, AdapterType] = adapterOptions;

        this._container.set(`adapter:${adapterName}`, AdapterType);
        this.connectTo(adapterName);

        return;
      }

      if (typeof adapterOptions === 'string') {
        this.connectTo(adapterOptions);

        return;
      }

      this.assert(
        `Invalid argument "${adapterOptions}" passed into \`configure({ adapters: [...] })\``,
        false
      );
    });

    this.persister = new (this._container.get(
      `persister:${this.config.persister}`
    ))(this);
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
    this.mode = Modes.RECORD;
  }

  /**
   * @public
   * @memberof Polly
   */
  replay() {
    this.mode = Modes.REPLAY;
  }

  /**
   * @public
   * @memberof Polly
   */
  pause() {
    this[PAUSED_MODE] = this.mode;
    this.mode = Modes.PASSTHROUGH;
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
    if (this.mode !== Modes.STOPPED) {
      this.disconnect();
      this.logger.disconnect();
      await this.persister.persist();
      this.mode = Modes.STOPPED;
    }
  }

  /**
   * @param {String} adapterName
   * @public
   * @memberof Polly
   */
  connectTo(adapterName) {
    this.assert(
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
