import set from 'lodash-es/set';
import deepmerge from 'deepmerge';

function adapterIdentifierTests() {
  describe('matchRequestsBy', function() {
    beforeEach(function() {
      const { polly } = this;

      polly.server.post('/*').intercept((req, res) => {
        res.sendStatus(200);
      });

      this.requests = captureRequests(polly.server);
    });

    testConfiguration('method', false, {
      expected: {
        id: 'e7e58325a54088ab228cd9dbe7558141',
        identifiers: {
          headers: { 'content-type': 'application/json;charset=utf-8' },
          body: '{}',
          url: 'http://localhost:4000/pathname?query=param'
        }
      },
      overrides: {
        'node-http': {
          id: '815b91955669771aa83a74ca27f6fbd8',
          identifiers: {
            headers: {
              host: 'localhost:4000'
            }
          }
        }
      }
    });

    testConfiguration('headers', false, {
      expected: {
        id: '74e48a0f5e33321aa1aa3f4f65c8ccde',
        identifiers: {
          method: 'POST',
          body: '{}',
          url: 'http://localhost:4000/pathname?query=param'
        }
      }
    });

    testConfiguration('body', false, {
      expected: {
        id: 'b0427f53912c03a68ea2d4e923e136a8',
        identifiers: {
          body: undefined,
          headers: { 'content-type': 'application/json;charset=utf-8' },
          method: 'POST',
          url: 'http://localhost:4000/pathname?query=param'
        }
      },
      overrides: {
        'node-http': {
          id: 'b58187c060d6d9e8605dc0d2e68a4cc4',
          identifiers: {
            headers: {
              host: 'localhost:4000'
            }
          }
        }
      }
    });

    testConfiguration('order', true, {
      expected: {
        id: '3dbff3c3fbccd6f97d01be31fc7fdd59',
        identifiers: {
          headers: { 'content-type': 'application/json;charset=utf-8' },
          method: 'POST',
          body: '{}',
          url: 'http://localhost:4000/pathname?query=param'
        }
      },
      overrides: {
        'node-http': {
          id: 'd0b5dfe199e75e370366c7570e402283',
          identifiers: {
            headers: {
              host: 'localhost:4000'
            }
          }
        }
      }
    });

    describe('url', function() {
      testConfiguration('url.protocol', false, {
        expected: {
          id: '79224baf23dc29f8115516cb8fe0546f',
          identifiers: {
            headers: { 'content-type': 'application/json;charset=utf-8' },
            method: 'POST',
            body: '{}',
            url: '//localhost:4000/pathname?query=param'
          }
        },
        overrides: {
          'node-http': {
            id: 'c24a09e0bd482ecafea2e6a523a2300c',
            identifiers: {
              headers: {
                host: 'localhost:4000'
              }
            }
          }
        }
      });

      testConfiguration('url.hostname', false, {
        expected: {
          id: 'e5afacdff75fdbbdee298c4114fe576a',
          identifiers: {
            headers: { 'content-type': 'application/json;charset=utf-8' },
            method: 'POST',
            body: '{}',
            url: 'http://:4000/pathname?query=param'
          }
        },
        overrides: {
          'node-http': {
            id: '754af334c21a6367de2f4a96a88b500c',
            identifiers: {
              headers: {
                host: 'localhost:4000'
              }
            }
          }
        }
      });

      testConfiguration('url.pathname', false, {
        expected: {
          id: 'bb2e8915ffeb6618c7095355ff16d141',
          identifiers: {
            headers: { 'content-type': 'application/json;charset=utf-8' },
            method: 'POST',
            body: '{}',
            url: 'http://localhost:4000?query=param'
          }
        },
        overrides: {
          'node-http': {
            id: '3575605055acca2b0d49f70fad6a8ea3',
            identifiers: {
              headers: {
                host: 'localhost:4000'
              }
            }
          }
        }
      });

      testConfiguration('url.port', false, {
        expected: {
          id: '97705c56f6fc0e59027bef42d87902c3',
          identifiers: {
            headers: { 'content-type': 'application/json;charset=utf-8' },
            method: 'POST',
            body: '{}',
            url: 'http://localhost/pathname?query=param'
          }
        },
        overrides: {
          'node-http': {
            id: 'fe9e1be1fbde1268cf010cc0003736cb',
            identifiers: {
              headers: {
                host: 'localhost:4000'
              }
            }
          }
        }
      });

      testConfiguration('url.query', false, {
        expected: {
          id: '534d71c078b3e446198b5060a560f900',
          identifiers: {
            headers: { 'content-type': 'application/json;charset=utf-8' },
            method: 'POST',
            body: '{}',
            url: 'http://localhost:4000/pathname'
          }
        },
        overrides: {
          'node-http': {
            id: '87788eaf035ab979bdd49cf2b4ff43f1',
            identifiers: {
              headers: {
                host: 'localhost:4000'
              }
            }
          }
        }
      });

      testConfiguration('url.hash', true, {
        expected: {
          id: '80d27c6c94767915e1ac5db46896820e',
          identifiers: {
            headers: { 'content-type': 'application/json;charset=utf-8' },
            method: 'POST',
            body: '{}',
            url: 'http://localhost:4000/pathname?query=param#abc'
          }
        },
        overrides: {
          'node-http': {
            id: 'd876bcf1151b72a1b1bdf2a88403d6b3',
            identifiers: {
              headers: {
                host: 'localhost:4000'
              }
            }
          }
        }
      });
    });
  });
}

function captureRequests(server) {
  const reqs = [];

  server.any().on('request', req => reqs.push(req));

  return reqs;
}

function lookupAdapterName(polly) {
  return [...polly.adapters.keys()][0];
}

function testConfiguration(optionName, value, expectedValues) {
  it(`${optionName}=${value}`, async function() {
    const adapterName = lookupAdapterName(this.polly);
    const expectedValue = deepmerge(
      expectedValues.expected || {},
      (expectedValues.overrides && expectedValues.overrides[adapterName]) || {}
    );

    const matchRequestsBy = set({}, optionName, value);

    this.polly.configure({
      matchRequestsBy
    });

    await this.fetch('http://localhost:4000/pathname?query=param#abc', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'content-type': 'application/json;charset=utf-8' }
    });

    const [targetRequest] = this.requests;

    if (targetRequest.identifiers) {
      expect(targetRequest.identifiers).to.deep.equal(
        expectedValue.identifiers
      );
    }

    expect(targetRequest.id).to.equal(expectedValue.id);
  });
}

export default adapterIdentifierTests;
