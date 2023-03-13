'use strict';

const {
  getOwnNonIndexProperties,
  getConstructorName,
  constants: {
    ALL_PROPERTIES,
    ONLY_ENUMERABLE
  }
} = require('../src/util');
const assert = require('assert');

assert(typeof getOwnNonIndexProperties === 'function');

const boo = Symbol('boo');
const boot = Symbol('boot');
const a = {
  foo: 1
};
Object.defineProperty(a, 'bar', {
  value: 2,
  enumberable: false
});
Object.defineProperty(a, boo, {
  value: 3,
  enumberable: false
});
a[boot] = 4;

assert.deepStrictEqual(
  getOwnNonIndexProperties(a, ALL_PROPERTIES),
  ['foo', 'bar', boo, boot]);

assert.deepStrictEqual(
  getOwnNonIndexProperties(a, ONLY_ENUMERABLE),
  ['foo', boot]);

assert.throws(() => getConstructorName(null));
assert.throws(() => getConstructorName(4));

const b = {};
Object.setPrototypeOf(b, null);
b[Symbol.toStringTag] = '';
assert.strictEqual(getConstructorName(b), 'Object');
