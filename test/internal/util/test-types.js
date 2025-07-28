'use strict';

require('../../common');
const {
  isMap,
  isNativeError,
  isSet,
} = require('../../../src/internal/util/types');
const assert = require('assert');
const vm = require('vm');

assert(isNativeError(new Error()));

class FooError extends Error {}
assert(isNativeError(new FooError()));

class Foo {}
assert(!isNativeError(new Foo()));

const s = new Foo();
Object.setPrototypeOf(s, global.Set.prototype);
assert(!isSet(s));

const sv = vm.runInNewContext('new Set()', {});
assert(isSet(sv));

const sm = vm.runInNewContext('new Map()', {});
assert(isMap(sm));

class Map {
  has() { return false; }
  [Symbol.iterator]() {}
  size = 0;
}

assert(!isMap(new Map()));

class Set {
  has() { return false; }
  [Symbol.iterator]() {}
  size = 0;
}

assert(!isMap(new Set()));
