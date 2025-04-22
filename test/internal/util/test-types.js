'use strict';

require('../../common');
const {
  isNativeError,
  isSet,
} = require('../../../src/internal/util/types');
const assert = require('assert');

assert(isNativeError(new Error()));

class FooError extends Error {}
assert(isNativeError(new FooError()));

class Foo {}
assert(!isNativeError(new Foo()));

const s = new Foo();
Object.setPrototypeOf(s, Set.prototype);
assert(!isSet(s));
