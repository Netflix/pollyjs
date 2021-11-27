import Adapter from '@pollyjs/adapter';
import Persister from '@pollyjs/persister';
import { MODES, PollyError } from '@pollyjs/utils';

import defaults from '../../src/defaults/config';
import Polly from '../../src/polly';
import { Container } from '../../src/-private/container';
import setupPolly from '../../src/test-helpers/mocha';

describe('Unit | Polly', function () {
  it('should exist', function () {
    expect(Polly).to.be.a('function');
  });

  it('should have a version', function () {
    expect(Polly.VERSION).to.be.a('string');
  });

  it('should instantiate without throwing', async function () {
    await expect(async function () {
      const polly = new Polly('recording name');

      await polly.stop();
    }).to.not.throw();
  });

  it('should throw with an empty recording name', async function () {
    for (const value of [undefined, null, '', '\n\r']) {
      const polly = new Polly('test');

      expect(() => (polly.recordingName = value)).to.throw(
        PollyError,
        /Invalid recording name provided/
      );

      await polly.stop();
    }
  });

  it('should be able to change the recording name', async function () {
    const polly = new Polly('squawk');

    expect(polly.recordingName).to.equal('squawk');
    polly.recordingName = 'squawk squawk';
    expect(polly.recordingName).to.equal('squawk squawk');

    await polly.stop();
  });

  it('should update the recording id when the name changes', async function () {
    const polly = new Polly('squawk');

    expect(polly.recordingName).to.equal('squawk');
    expect(polly.recordingId).to.contain('squawk');
    polly.recordingName = 'chirp';
    expect(polly.recordingName).to.equal('chirp');
    expect(polly.recordingId).to.contain('chirp');

    await polly.stop();
  });

  it('can manually set the mode', async function () {
    const polly = new Polly('squawk');

    expect(polly.mode).to.equal('replay');
    polly.mode = 'record';
    expect(polly.mode).to.equal('record');

    await polly.stop();
  });

  it('throws on an invalid mode', async function () {
    const polly = new Polly('squawk');

    expect(() => (polly.mode = 'INVALID')).to.throw(
      PollyError,
      /Invalid mode provided/
    );

    await polly.stop();
  });

  it('it supports custom adapters', async function () {
    let connectCalled, disconnectCalled;

    class MockAdapter extends Adapter {
      static get id() {
        return 'mock';
      }

      onConnect() {
        connectCalled = true;
      }

      onDisconnect() {
        disconnectCalled = true;
      }
    }

    const polly = new Polly('recording name', { adapters: [MockAdapter] });

    await polly.stop();

    expect(connectCalled).to.be.true;
    expect(disconnectCalled).to.be.true;
  });

  it('it supports custom persisters', async function () {
    let instantiated, persistCalled;

    class MockPersister extends Persister {
      static get id() {
        return 'mock';
      }

      constructor() {
        super(...arguments);
        instantiated = true;
      }

      persist() {
        persistCalled = true;
        super.persist(...arguments);
      }
    }

    const polly = new Polly('recording name', { persister: MockPersister });

    await polly.stop();

    expect(instantiated).to.be.true;
    expect(persistCalled).to.be.true;
  });

  it('calls flush when flushRequestsOnStop is enabled', async function () {
    let polly = new Polly('squawk', { flushRequestsOnStop: false });
    let flushCalled = false;

    polly.flush = async () => {
      flushCalled = true;
    };

    await polly.stop();
    expect(flushCalled).to.be.false;

    polly = new Polly('squawk', { flushRequestsOnStop: true });
    flushCalled = false;

    polly.flush = async () => {
      flushCalled = true;
    };

    await polly.stop();
    expect(flushCalled).to.be.true;
  });

  describe('configure', function () {
    setupPolly();

    it('should not be configurable once requests are handled', async function () {
      this.polly._requests.push({});
      expect(() => this.polly.configure()).to.throw(
        PollyError,
        'Cannot call `configure` once requests have been handled.'
      );
    });

    it('should not be configurable once stopped', async function () {
      await this.polly.stop();

      expect(() => this.polly.configure()).to.throw(
        PollyError,
        'Cannot call `configure` on an instance of Polly that is not running.'
      );
    });

    it('should deep merge configure options with defaults', async function () {
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

    it('should not deep merge adapter options', async function () {
      class MockAdapterA extends Adapter {
        static get id() {
          return 'mock-a';
        }

        onConnect() {}
        onDisconnect() {}
      }

      class MockAdapterB extends MockAdapterA {
        static get id() {
          return 'mock-b';
        }
      }

      expect(this.polly.config.adapters.length).to.equal(0);

      this.polly.configure({ adapters: [MockAdapterA] });
      this.polly.configure({ adapters: [MockAdapterB] });

      expect(this.polly.config.adapters.length).to.equal(1);
      expect(this.polly.adapters.has('mock-a')).to.be.false;
      expect(this.polly.adapters.has('mock-b')).to.be.true;
    });

    it('should connect to new adapters', async function () {
      let connectCalled = false;

      class MockAdapter extends Adapter {
        static get id() {
          return 'mock';
        }

        onConnect() {
          connectCalled = true;
        }
        onDisconnect() {}
      }

      expect(connectCalled).to.be.false;
      this.polly.configure({ adapters: [MockAdapter] });
      expect(connectCalled).to.be.true;
    });

    it('should disconnect from adapters before connecting', async function () {
      let connectCount = 0;
      let disconnectCount = 0;

      class MockAdapter extends Adapter {
        static get id() {
          return 'mock';
        }

        onConnect() {
          connectCount++;
        }
        onDisconnect() {
          disconnectCount++;
        }
      }

      this.polly.configure({ adapters: [MockAdapter] });
      expect(connectCount).to.equal(1);
      expect(disconnectCount).to.equal(0);

      this.polly.configure({ adapters: [MockAdapter] });
      expect(connectCount).to.equal(2);
      expect(disconnectCount).to.equal(1);
    });
  });

  describe('API', function () {
    setupPolly();

    class MockAdapterA extends Adapter {
      static get id() {
        return 'adapter-a';
      }

      onConnect() {}
      onDisconnect() {}
    }

    class MockAdapterB extends MockAdapterA {
      static get id() {
        return 'adapter-b';
      }
    }

    it('.record()', async function () {
      this.polly.mode = MODES.REPLAY;

      expect(this.polly.mode).to.equal(MODES.REPLAY);
      this.polly.record();
      expect(this.polly.mode).to.equal(MODES.RECORD);
    });

    it('.replay()', async function () {
      this.polly.mode = MODES.RECORD;

      expect(this.polly.mode).to.equal(MODES.RECORD);
      this.polly.replay();
      expect(this.polly.mode).to.equal(MODES.REPLAY);
    });

    it('.passthrough()', async function () {
      this.polly.mode = MODES.RECORD;

      expect(this.polly.mode).to.equal(MODES.RECORD);
      this.polly.passthrough();
      expect(this.polly.mode).to.equal(MODES.PASSTHROUGH);
    });

    it('.pause()', async function () {
      this.polly.configure({ adapters: [MockAdapterA, MockAdapterB] });

      expect([...this.polly.adapters.keys()]).to.deep.equal([
        'adapter-a',
        'adapter-b'
      ]);
      this.polly.pause();
      expect([...this.polly.adapters.keys()]).to.deep.equal([]);
    });

    it('.play()', async function () {
      this.polly.configure({ adapters: [MockAdapterA, MockAdapterB] });

      expect([...this.polly.adapters.keys()]).to.deep.equal([
        'adapter-a',
        'adapter-b'
      ]);
      this.polly.play();
      expect([...this.polly.adapters.keys()]).to.deep.equal([
        'adapter-a',
        'adapter-b'
      ]);
      this.polly.pause();
      expect([...this.polly.adapters.keys()]).to.deep.equal([]);
      this.polly.play();
      expect([...this.polly.adapters.keys()]).to.deep.equal([
        'adapter-a',
        'adapter-b'
      ]);
    });

    it('.stop()', async function () {
      this.polly.mode = MODES.RECORD;
      expect(this.polly.mode).to.equal(MODES.RECORD);

      const promise = this.polly.stop();

      expect(promise).to.be.a('promise');
      await promise;
      expect(this.polly.mode).to.equal(MODES.STOPPED);
    });

    it('.connectTo()', async function () {
      let connectCount = 0;
      let disconnectCount = 0;

      class MockAdapter extends Adapter {
        static get id() {
          return 'mock';
        }

        onConnect() {
          connectCount++;
        }

        onDisconnect() {
          disconnectCount++;
        }
      }

      this.polly.container.register(MockAdapter);

      this.polly.connectTo('mock');
      expect(connectCount).to.equal(1);
      expect(disconnectCount).to.equal(0);

      this.polly.connectTo(MockAdapter);
      expect(connectCount).to.equal(2);
      expect(disconnectCount).to.equal(1);
    });

    it('.disconnectTo()', async function () {
      let connectCount = 0;
      let disconnectCount = 0;

      class MockAdapter extends Adapter {
        static get id() {
          return 'mock';
        }

        onConnect() {
          connectCount++;
        }

        onDisconnect() {
          disconnectCount++;
        }
      }

      this.polly.container.register(MockAdapter);

      this.polly.connectTo('mock');
      expect(connectCount).to.equal(1);
      this.polly.disconnectFrom('mock');
      expect(disconnectCount).to.equal(1);

      this.polly.connectTo(MockAdapter);
      expect(connectCount).to.equal(2);
      this.polly.disconnectFrom(MockAdapter);
      expect(disconnectCount).to.equal(2);
    });

    it('.disconnect()', async function () {
      const disconnects = [];

      class MockAdapterA extends Adapter {
        static get id() {
          return 'mock-a';
        }

        onConnect() {}

        onDisconnect() {
          disconnects.push(true);
        }
      }

      class MockAdapterB extends MockAdapterA {
        static get id() {
          return 'mock-b';
        }
      }

      // configure automatically connects to the new adapter
      this.polly.configure({ adapters: [MockAdapterA, MockAdapterB] });

      expect(disconnects.length).to.equal(0);
      expect(this.polly.disconnect());
      expect(disconnects.length).to.equal(2);
    });

    it('.flush()', async function () {
      const promise = this.polly.flush();

      expect(promise).to.be.a('promise');
      await promise;
    });
  });

  describe('Class Methods & Events', function () {
    it('should be event-able', function () {
      expect(Polly.on).to.be.a('function');
      expect(Polly.once).to.be.a('function');
      expect(Polly.off).to.be.a('function');
    });

    describe('Methods', function () {
      class MockAdapter extends Adapter {
        static get id() {
          return 'mock';
        }
      }

      it('.register()', async function () {
        Polly.register(MockAdapter);

        const polly = new Polly('Test');

        expect(polly.container.has('adapter:mock')).to.be.true;

        await polly.stop();
        Polly.unregister(MockAdapter);
      });

      it('.unregister()', async function () {
        Polly.register(MockAdapter);

        let polly = new Polly('Test');

        expect(polly.container.has('adapter:mock')).to.be.true;
        await polly.stop();

        Polly.unregister(MockAdapter);

        polly = new Polly('Test');
        expect(polly.container.has('adapter:mock')).to.be.false;
        await polly.stop();
      });
    });

    describe('Events', function () {
      it('register', async function () {
        let registerCalled = false;

        Polly.once('register', (container) => {
          expect(container).to.be.an.instanceof(Container);
          registerCalled = true;
        });

        const polly = new Polly('Test');

        expect(registerCalled).to.be.true;
        await polly.stop();
      });

      it('create', async function () {
        let createCalled = false;

        Polly.once('create', (polly) => {
          expect(polly).to.be.an.instanceof(Polly);
          createCalled = true;
        });

        const polly = new Polly('Test');

        expect(createCalled).to.be.true;
        await polly.stop();
      });

      it('create - should throw with an async listener', async function () {
        Polly.once('create', () => {});
        Polly.once('create', () => Promise.resolve());

        expect(() => new Polly('Test')).to.throw(PollyError);
      });

      it('create - configuration order should be preserved', async function () {
        Polly.once('create', (polly) => {
          polly.configure({ logging: true, recordIfMissing: false });
        });

        const polly = new Polly('Test', { recordIfMissing: true });

        expect(polly.config.logging).to.be.true;
        expect(polly.config.recordIfMissing).to.be.true;
        await polly.stop();
      });

      it('stop', async function () {
        let stopCalled = false;

        Polly.once('stop', (polly) => {
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
});
