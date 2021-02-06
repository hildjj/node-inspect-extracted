'use strict'

const {
  inspect
} = require('../src/inspect');
const assert = require('assert');

import('./fixture.mjs').then(m => {
  assert(m);
  assert.strictEqual(inspect(m), '[Module: null prototype] { default: 4 }');

  const o = {
    default: 4,
    [Symbol.stringTag]: 'Module'
  };
  // TODO: this should fail
  assert.strictEqual(inspect(m), '[Module: null prototype] { default: 4 }');
});
