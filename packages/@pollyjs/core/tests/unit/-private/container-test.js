import { PollyError } from '@pollyjs/utils';

import { Container } from '../../../src/-private/container';

let container;

class Factory {
  static get id() {
    return 'factory-id';
  }

  static get type() {
    return 'factory';
  }
}

describe('Unit | Container', function() {
  it('should exist', function() {
    expect(() => new Container()).to.not.throw();
    expect(new Container()).to.exist;
  });

  describe('API', function() {
    beforeEach(function() {
      container = new Container();
    });

    it('.register()', function() {
      container.register(Factory);
      expect(container.has('factory:factory-id')).to.be.true;
    });

    it('.register() - validation', function() {
      class NoId extends Factory {
        static get id() {
          return undefined;
        }
      }

      class NoType extends Factory {
        static get type() {
          return undefined;
        }
      }

      expect(() => container.register()).to.throw(
        PollyError,
        /invalid factory provided/
      );
      expect(() => container.register(NoId)).to.throw(
        PollyError,
        /Invalid registration id provided/
      );
      expect(() => container.register(NoType)).to.throw(
        PollyError,
        /Invalid registration type provided/
      );
    });

    it('.unregister() - by key', function() {
      container.register(Factory);
      expect(container.has('factory:factory-id')).to.be.true;

      container.unregister('factory:factory-id');
      expect(container.has('factory:factory-id')).to.be.false;
    });

    it('.unregister() - by factory', function() {
      container.register(Factory);
      expect(container.has('factory:factory-id')).to.be.true;

      container.unregister(Factory);
      expect(container.has('factory:factory-id')).to.be.false;
    });

    it('.lookup()', function() {
      container.register(Factory);
      expect(container.lookup('factory:factory-id')).to.equal(Factory);
      expect(container.lookup('factory:bar')).to.be.null;
    });

    it('.has() - by key', function() {
      container.register(Factory);
      expect(container.has('factory:factory-id')).to.be.true;
      expect(container.has('factory:bar')).to.be.false;
    });

    it('.has() - by factory', function() {
      class ExtendedFactory extends Factory {
        static get id() {
          return 'extended-factory-id';
        }
      }

      container.register(Factory);
      expect(container.has(Factory)).to.be.true;
      expect(container.has(ExtendedFactory)).to.be.false;
    });
  });
});
