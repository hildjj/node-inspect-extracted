'use strict';

require('./common');
const {
  inspect,
} = require('../src/inspect');
const assert = require('assert');

import('./fixture.mjs').then((m) => {
  assert(m);
  assert.strictEqual(inspect(m), '[Module: null prototype] { default: 4 }');

  const o = {
    default: 4,
    [Symbol.stringTag]: 'Module',
  };
  assert.notStrictEqual(inspect(o), '[Module: null prototype] { default: 4 }');
}, (e) => {
  // Node 10 doesn't have import
  assert(e.message, 'Not supported');
});
