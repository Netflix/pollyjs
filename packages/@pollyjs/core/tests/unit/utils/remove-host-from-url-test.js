import { URL } from '@pollyjs/utils';

import removeHost from '../../../src/utils/remove-host-from-url';

describe('Unit | Utils | removeHostFromUrl', function () {
  it('should exist', function () {
    expect(removeHost).to.be.a('function');
  });

  it('should remove hostname', function () {
    const url = removeHost(new URL('http://foo.com/bar/baz/'));

    expect(url.toString()).to.equal('/bar/baz/');
  });

  it('should remove hostname without a tld', function () {
    const url = removeHost(new URL('http://foo/bar/baz/'));

    expect(url.toString()).to.equal('/bar/baz/');
  });
});
