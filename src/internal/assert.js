'use strict';

module.exports = function assert(p) {
  if (!p) {
    throw new Error('Assertion failed');
  }
};
