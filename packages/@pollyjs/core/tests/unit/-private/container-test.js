import { PollyError } from '@pollyjs/utils';

import Container from '../../../src/-private/container';

let container;

class Factory {
  static get name() {
    return 'foo';
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
      expect(container.has('factory:foo')).to.be.true;
    });

    it('.register() - validation', function() {
      class NoName extends Factory {
        /* eslint-disable-next-line getter-return */
        static get name() {}
      }

      class NoType extends Factory {
        /* eslint-disable-next-line getter-return */
        static get type() {}
      }

      expect(() => container.register()).to.throw(
        PollyError,
        /invalid factory provided/
      );
      expect(() => container.register(NoName)).to.throw(
        PollyError,
        /Invalid registration name provided/
      );
      expect(() => container.register(NoType)).to.throw(
        PollyError,
        /Invalid registration type provided/
      );
    });

    it('.unregister() - by key', function() {
      container.register(Factory);
      expect(container.has('factory:foo')).to.be.true;

      container.unregister('factory:foo');
      expect(container.has('factory:foo')).to.be.false;
    });

    it('.unregister() - by factory', function() {
      container.register(Factory);
      expect(container.has('factory:foo')).to.be.true;

      container.unregister(Factory);
      expect(container.has('factory:foo')).to.be.false;
    });

    it('.lookup()', function() {
      container.register(Factory);
      expect(container.lookup('factory:foo')).to.equal(Factory);
      expect(container.lookup('factory:bar')).to.be.null;
    });

    it('.has() - by key', function() {
      container.register(Factory);
      expect(container.has('factory:foo')).to.be.true;
      expect(container.has('factory:bar')).to.be.false;
    });

    it('.has() - by factory', function() {
      container.register(Factory);
      expect(container.has(Factory)).to.be.true;
      expect(container.has(class Foo extends Factory {})).to.be.false;
    });
  });
});
