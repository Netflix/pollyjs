import defaults from '../../src/defaults/config';
import Polly from '../../src/polly';
import setupPolly from '../../src/test-helpers/mocha';
import Adapter from '@pollyjs/adapter';
import Persister from '@pollyjs/persister';
import { MODES } from '@pollyjs/utils';

const nativeFetch = global.fetch;

describe('Unit | Polly', function() {
  it('should exist', function() {
    expect(Polly).to.be.a('function');
  });

  it('should instantiate without throwing', async function() {
    await expect(async function() {
      const polly = new Polly('recording name');

      await polly.stop();
    }).to.not.throw();
  });

  it('should throw with an empty recording name', async function() {
    for (const value of [undefined, null, '', '\n\r']) {
      const polly = new Polly('test', { adapters: [] });

      expect(() => (polly.recordingName = value)).to.throw(
        Error,
        /not a valid recording name/
      );

      await polly.stop();
    }
  });

  it('should be able to change the recording name', async function() {
    const polly = new Polly('squawk', { adapters: [] });

    expect(polly.recordingName).to.equal('squawk');
    polly.recordingName = 'squawk squawk';
    expect(polly.recordingName).to.equal('squawk squawk');

    await polly.stop();
  });

  it('should update the recording id when the name changes', async function() {
    const polly = new Polly('squawk', { adapters: [] });

    expect(polly.recordingName).to.equal('squawk');
    expect(polly.recordingId).to.contain('squawk');
    polly.recordingName = 'chirp';
    expect(polly.recordingName).to.equal('chirp');
    expect(polly.recordingId).to.contain('chirp');

    await polly.stop();
  });

  it('can manually set the mode', async function() {
    const polly = new Polly('squawk', { adapters: [] });

    expect(polly.mode).to.equal('replay');
    polly.mode = 'record';
    expect(polly.mode).to.equal('record');

    await polly.stop();
  });

  it('throws on an invalid mode', async function() {
    const polly = new Polly('squawk', { adapters: [] });

    expect(() => (polly.mode = 'INVALID')).to.throw(
      Error,
      /Invalid mode provided/
    );

    await polly.stop();
  });

  it('it supports overriding default adapters', async function() {
    let connectCalled, disconnectCalled;

    class MockAdapter extends Adapter {
      onConnect() {
        connectCalled = true;
      }

      onDisconnect() {
        disconnectCalled = true;
      }

      toString() {
        return 'MockAdapter';
      }
    }

    const polly = new Polly('recording name', {
      adapters: [['fetch', MockAdapter]]
    });

    await polly.stop();

    expect(connectCalled).to.be.true;
    expect(disconnectCalled).to.be.true;
  });

  it('it supports overriding default persisters', async function() {
    let instantiated, persistCalled;

    class MockPersister extends Persister {
      constructor() {
        super(...arguments);
        instantiated = true;
      }

      persist() {
        persistCalled = true;
        super.persist(...arguments);
      }
    }

    const polly = new Polly('recording name', {
      persister: ['local-storage', MockPersister]
    });

    await polly.stop();

    expect(instantiated).to.be.true;
    expect(persistCalled).to.be.true;
  });

  describe('configure', function() {
    setupPolly({ adapters: [] });

    it('should not be configurable once requests are handled', async function() {
      const { server } = this.polly;

      this.polly.configure({ adapters: ['fetch'] });
      server.get('/ping').intercept((req, res) => res.status(200));

      expect((await fetch('/ping')).status).to.equal(200);
      expect(() => this.polly.configure()).to.throw(
        Error,
        '[Polly] Cannot call `configure` once requests have been handled.'
      );
    });

    it('should not be configurable once stopped', async function() {
      await this.polly.stop();

      expect(() => this.polly.configure()).to.throw(
        Error,
        '[Polly] Cannot call `configure` on an instance of Polly that is not running.'
      );
    });

    it('should deep merge configure options with defaults', async function() {
      this.polly.configure({
        matchRequestsBy: {
          url: {
            port: !defaults.matchRequestsBy.url.port
          }
        }
      });

      expect(this.polly.config.matchRequestsBy.url.port).to.be.false;
      expect(this.polly.config.matchRequestsBy.url).to.deep.equal({
        ...defaults.matchRequestsBy.url,
        port: !defaults.matchRequestsBy.url.port
      });
    });

    it('should not deep merge adapter options', async function() {
      this.polly.configure({ adapters: [] });
      expect(this.polly.config.adapters.length).to.equal(0);

      this.polly.configure({ adapters: ['fetch'] });
      this.polly.configure({ adapters: ['xhr'] });
      expect(this.polly.config.adapters.length).to.equal(1);
    });

    it('should connect to new adapters', async function() {
      expect(nativeFetch).to.equal(global.fetch);
      this.polly.configure({ adapters: ['fetch'] });
      expect(nativeFetch).to.not.equal(global.fetch);
    });
  });

  describe('API', function() {
    setupPolly({ adapters: [] });

    it('.record()', async function() {
      this.polly.mode = MODES.REPLAY;

      expect(this.polly.mode).to.equal(MODES.REPLAY);
      this.polly.record();
      expect(this.polly.mode).to.equal(MODES.RECORD);
    });

    it('.replay()', async function() {
      this.polly.mode = MODES.RECORD;

      expect(this.polly.mode).to.equal(MODES.RECORD);
      this.polly.replay();
      expect(this.polly.mode).to.equal(MODES.REPLAY);
    });

    it('.pause()', async function() {
      this.polly.mode = MODES.RECORD;

      expect(this.polly.mode).to.equal(MODES.RECORD);
      this.polly.pause();
      expect(this.polly.mode).to.equal(MODES.PASSTHROUGH);
    });

    it('.play()', async function() {
      this.polly.mode = MODES.RECORD;

      expect(this.polly.mode).to.equal(MODES.RECORD);
      this.polly.play();
      expect(this.polly.mode).to.equal(MODES.RECORD);
      this.polly.pause();
      expect(this.polly.mode).to.equal(MODES.PASSTHROUGH);
      this.polly.play();
      expect(this.polly.mode).to.equal(MODES.RECORD);
    });

    it('.stop()', async function() {
      this.polly.mode = MODES.RECORD;
      expect(this.polly.mode).to.equal(MODES.RECORD);

      const promise = this.polly.stop();

      expect(promise).to.be.a('promise');
      await promise;
      expect(this.polly.mode).to.equal(MODES.STOPPED);
    });

    it('.connectTo()', async function() {
      let connectCalled;

      class MockAdapter extends Adapter {
        onConnect() {
          connectCalled = true;
        }

        onDisconnect() {}

        toString() {
          return 'MockAdapter';
        }
      }

      this.polly.configure({ adapters: [['mock-adapter', MockAdapter]] });
      // configure automatically connects to the new adapter
      this.polly.disconnectFrom('mock-adapter');
      connectCalled = false;

      expect(connectCalled).to.be.false;
      expect(this.polly.connectTo('mock-adapter'));
      expect(connectCalled).to.be.true;
    });

    it('.disconnectFrom()', async function() {
      let disconnectCalled = false;

      class MockAdapter extends Adapter {
        onConnect() {}

        onDisconnect() {
          disconnectCalled = true;
        }

        toString() {
          return 'MockAdapter';
        }
      }

      // configure automatically connects to the new adapter
      this.polly.configure({ adapters: [['mock-adapter', MockAdapter]] });

      expect(disconnectCalled).to.be.false;
      expect(this.polly.disconnectFrom('mock-adapter'));
      expect(disconnectCalled).to.be.true;
    });

    it('.disconnect()', async function() {
      const disconnects = [];

      class MockAdapter extends Adapter {
        onConnect() {}

        onDisconnect() {
          disconnects.push(true);
        }

        toString() {
          return 'MockAdapter';
        }
      }

      // configure automatically connects to the new adapter
      this.polly.configure({
        adapters: [
          ['mock-adapter', MockAdapter],
          ['mock-adapter-2', MockAdapter]
        ]
      });

      expect(disconnects.length).to.equal(0);
      expect(this.polly.disconnect());
      expect(disconnects.length).to.equal(2);
    });
  });

  describe('Class Events', function() {
    it('should be event-able', function() {
      expect(Polly.on).to.be.a('function');
      expect(Polly.once).to.be.a('function');
      expect(Polly.off).to.be.a('function');
    });

    it('create', async function() {
      let createCalled = false;

      Polly.once('create', polly => {
        expect(polly).to.be.an.instanceof(Polly);
        createCalled = true;
      });

      const polly = new Polly('Test');

      expect(createCalled).to.be.true;
      await polly.stop();
    });

    it('create - should throw with an async listener', async function() {
      Polly.once('create', () => {});
      Polly.once('create', () => Promise.resolve());

      expect(() => new Polly('Test', { adapters: [] })).to.throw(Error);
    });

    it('create - configuration order should be preserved', async function() {
      Polly.once('create', polly => {
        polly.configure({ logging: true, recordIfMissing: false });
      });

      const polly = new Polly('Test', { recordIfMissing: true });

      expect(polly.config.logging).to.be.true;
      expect(polly.config.recordIfMissing).to.be.true;
      await polly.stop();
    });

    it('stop', async function() {
      let stopCalled = false;

      Polly.once('stop', polly => {
        expect(polly).to.be.an.instanceof(Polly);
        expect(polly.mode).to.equal(MODES.STOPPED);
        stopCalled = true;
      });

      const polly = new Polly('Test');

      await polly.stop();
      expect(stopCalled).to.be.true;
    });
  });
});
