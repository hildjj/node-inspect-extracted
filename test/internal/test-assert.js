'use strict';

require('../common');
const a = require('../../src/internal/assert');
const assert = require('assert');

const message = 'This is caused by either a bug in Node.js ' +
  'or incorrect usage of Node.js internals.\n' +
  'Please open an issue with this stack trace at ' +
  'https://github.com/nodejs/node/issues\n';

assert.throws(() => a(false), { message });
assert.throws(() => a.fail('error message'), { message: 'error message\n' + message });
