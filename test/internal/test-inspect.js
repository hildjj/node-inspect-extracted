'use strict';

const assert = require('assert');
const util = require('../../src/inspect.js');

// Errors thrown in accessors are re-thrown
{
  const obj = new Proxy({}, {
    get() {
      throw new Error('Error message');
    },
  });

  assert.throws(() => util.format(obj), { message: 'Error message' });
}
