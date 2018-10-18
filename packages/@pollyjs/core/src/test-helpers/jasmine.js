import { afterEach, beforeEach } from './lib';

/**
 * Flag, showing that Polly is active
 */
const IS_POLLY_ACTIVE = Symbol('IS_POLLY_ACTIVE');

/**
 * Flag, showing that proxy test methods are attached
 */
const IS_POLLY_ATTACHED = Symbol('IS_POLLY_ATTACHED');

/**
 * Shared context to keep polly instance and
 * options for a specific run
 */
const pollyContext = {
  polly: null,
  options: {}
};

/**
 * Get full spec description, starting from the top
 * suite
 *
 * @param {Object} spec Current spec
 * @param {Object} suite Current spec parent suite
 *
 * @returns {string} Full spec description (e.g. "suite/should do something")
 */
function getRecordingName(spec, suite) {
  const descriptions = [spec.description];

  while (suite) {
    suite.description && descriptions.push(suite.description);
    suite = suite.parentSuite;
  }

  return descriptions.reverse().join('/');
}

/**
 * Recursively go through suite and its children
 * and return the first that matches the findFn
 * condition
 *
 * @param {Object} suite Starting point
 * @param {Function} findFn Find function
 *
 * @returns {?Object} Matching suite or null
 */
function findSuiteRec(suite, findFn) {
  if (findFn(suite)) return suite;

  for (const child of suite.children || []) {
    const result = findSuiteRec(child, findFn);

    if (result !== null) {
      return result;
    }
  }

  return null;
}

/**
 * Create proxy for jasmine test function that starts and
 * stops Polly on before/after hooks
 *
 * @param {Function} fn Original test runner test function
 * @param {Object} jasmineEnv Jasmine environment
 *
 * @returns {Function} Proxy function
 */
function createTestFnProxy(fn, jasmineEnv) {
  return function testFn() {
    const spec = fn.apply(jasmineEnv, arguments);
    const specHooks = spec.beforeAndAfterFns;

    spec.beforeAndAfterFns = function beforeAndAfterFns() {
      const { befores, afters } = specHooks.apply(spec, arguments);

      const before = async function before(done) {
        if (jasmineEnv[IS_POLLY_ACTIVE]) {
          const topSuite = jasmineEnv.topSuite();
          const specParentSuite = findSuiteRec(topSuite, suite =>
            (suite.children || []).some(child => child.id === spec.id)
          );

          let recordingName = getRecordingName(spec, specParentSuite);

          // In jest top suite description is empty, in jasmine it is
          // randomly generated string. We don't want it to be used
          // as recording name if it exists
          if (topSuite.description) {
            recordingName = recordingName.replace(
              `${topSuite.description}/`,
              ''
            );
          }

          await beforeEach(pollyContext, recordingName, pollyContext.options);
        }

        done && done();
      };

      const after = async function after(done) {
        if (jasmineEnv[IS_POLLY_ACTIVE]) {
          await afterEach(pollyContext, 'jasmine');
        }

        done && done();
      };

      return {
        befores: [{ fn: before }].concat(befores),
        afters: afters.concat({ fn: after })
      };
    };

    return spec;
  };
}

/**
 * Attach test fn proxies to jasmine environment if needed and
 * add beforeAll/afterAll hooks that will activate/deactivate
 * Polly when running test suite
 *
 * @param {Object} defaults Polly default options
 * @param {Object} ctx Global context
 *
 * @returns {Object} Context with `polly` property
 */
export default function setupJasmine(defaults = {}, ctx = global) {
  if (
    !ctx.jasmine ||
    (ctx.jasmine && typeof ctx.jasmine.getEnv !== 'function')
  ) {
    throw new TypeError(
      'Couldn\'t find jasmine environment. Make sure that you are using "setupJasmine" in ' +
        'jasmine/jest environment or that you provided proper jasmine environment when calling "setupJasmine"'
    );
  }

  const jasmineEnv = ctx.jasmine.getEnv();

  pollyContext.options = defaults;

  if (!jasmineEnv[IS_POLLY_ATTACHED]) {
    jasmineEnv.it = createTestFnProxy(jasmineEnv.it, jasmineEnv);
    jasmineEnv.fit = createTestFnProxy(jasmineEnv.fit, jasmineEnv);

    jasmineEnv[IS_POLLY_ATTACHED] = true;
    jasmineEnv[IS_POLLY_ACTIVE] = false;
  }

  ctx.beforeAll(() => {
    jasmineEnv[IS_POLLY_ACTIVE] = true;
  });

  ctx.afterAll(() => {
    jasmineEnv[IS_POLLY_ACTIVE] = false;
  });

  return {
    get polly() {
      return pollyContext.polly;
    }
  };
}

setupJasmine.IS_POLLY_ACTIVE = IS_POLLY_ACTIVE;

setupJasmine.IS_POLLY_ATTACHED = IS_POLLY_ATTACHED;
