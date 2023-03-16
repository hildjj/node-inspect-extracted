'use strict';

const {
  codes: {
    ERR_INVALID_ARG_TYPE,
  },
} = require('../../src/internal/errors');
const assert = require('assert');

assert.throws(() => {
  throw new ERR_INVALID_ARG_TYPE('first argument', 'Object', 4);
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  message: 'The first argument must be of type object. Received type number (4)',
});

let e = new ERR_INVALID_ARG_TYPE('foo.bar', 'Object', 4);
assert.strictEqual(
  e.message,
  'The "foo.bar" property must be of type object. Received type number (4)');
assert.strictEqual(
  e.toString(),
  'TypeError [ERR_INVALID_ARG_TYPE]: The "foo.bar" property must be of ' +
  'type object. Received type number (4)',
);

e = new ERR_INVALID_ARG_TYPE('foo', 'Foo', 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be an instance of Foo. Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', 'bar', 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be bar. Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['Foo', 'object'], 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be an instance of Foo or Object. Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['Foo', 'Bar'], 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be an instance of Foo or ' +
  'Bar. Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['Foo', 'Bar', 'Baz'], 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be an instance of Foo, Bar, or ' +
  'Baz. Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['boolean', 'bigint'], 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be one of type boolean or bigint. ' +
  'Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['boolean', 'bigint', 'symbol'], 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be one of type boolean, bigint, or symbol. ' +
  'Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['bar', 'baz'], 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be one of bar or baz. ' +
  'Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['Foo', 'bar', 'baz', 'boo'], 4);
assert.strictEqual(
  e.message,
  'The "foo" argument must be an instance of Foo or one of bar, baz, or boo. ' +
  'Received type number (4)');

e = new ERR_INVALID_ARG_TYPE('foo', ['fOO'], function boots() {});
assert.strictEqual(
  e.message,
  'The "foo" argument must be an fOO. ' +
  'Received function boots');

class Foo {}
e = new ERR_INVALID_ARG_TYPE('foo', ['fOO'], new Foo());
assert.strictEqual(
  e.message,
  'The "foo" argument must be an fOO. ' +
  'Received an instance of Foo');

const o = { a: 1 };
Object.setPrototypeOf(o, null);
e = new ERR_INVALID_ARG_TYPE('foo', ['number'], o);
assert.strictEqual(
  e.message,
  'The "foo" argument must be of type number. ' +
  'Received [Object: null prototype]');

e = new ERR_INVALID_ARG_TYPE(
  'foo',
  ['number'],
  BigInt('123456789012345678901234567890'));
assert.strictEqual(
  e.message,
  'The "foo" argument must be of type number. ' +
  'Received type bigint (1234567890123456789012345...)');
