// Flags: --expose-internals
'use strict';

// Cut down set of tests to just the ones we use.
require('../common');
const assert = require('assert');
const {
  validateObject,
  kValidateObjectAllowNullable,
  kValidateObjectAllowArray,
  kValidateObjectAllowFunction,
  validateString,
} = require('../../src/internal/validators');
const invalidArgTypeError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
};

{
  // validateObject tests.
  validateObject({}, 'foo');
  validateObject({ a: 42, b: 'foo' }, 'foo');

  [undefined, null, true, false, 0, 0.0, 42, '', 'string', [], () => {}]
    .forEach((val) => {
      assert.throws(() => {
        validateObject(val, 'foo');
      }, invalidArgTypeError);
    });

  // validateObject options tests:
  validateObject(null, 'foo', kValidateObjectAllowNullable);
  validateObject([], 'foo', kValidateObjectAllowArray);
  validateObject(() => {}, 'foo', kValidateObjectAllowFunction);

  // validateObject should not be affected by Object.prototype tampering.
  assert.throws(() => validateObject(null, 'foo', kValidateObjectAllowArray), invalidArgTypeError);
  assert.throws(() => validateObject([], 'foo', kValidateObjectAllowNullable), invalidArgTypeError);
  assert.throws(() => validateObject(() => {}, 'foo', kValidateObjectAllowNullable), invalidArgTypeError);
}

{
  // validateString type validation.
  [
    -1, {}, [], false, true,
    1, Infinity, -Infinity, NaN,
    undefined, null, 1.1,
  ].forEach((i) => assert.throws(() => validateString(i, 'name'), {
    code: 'ERR_INVALID_ARG_TYPE'
  }));
}
