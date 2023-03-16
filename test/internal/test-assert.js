'use strict';

const a = require('../../src/internal/assert');
const assert = require('assert');

assert.throws(() => a(false), { message: 'Assertion failed' });
assert.throws(() => a.fail('error message'), { message: 'error message' });
