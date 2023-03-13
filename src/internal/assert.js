'use strict';

function assert(p) {
  if (!p) {
    throw new Error('Assertion failed');
  }
}

assert.fail = function fail(message) {
  throw new Error(message);
};

module.exports = assert;
