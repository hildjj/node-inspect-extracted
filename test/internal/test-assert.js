'use strict';

const a = require('../../src/internal/assert');
const assert = require('assert');

assert.throws(() => a(false));
