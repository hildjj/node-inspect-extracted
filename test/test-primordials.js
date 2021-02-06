'use strict';

const {
  makeSafe,
  internalBinding,
  SafeMap
} = require('../src/primordials');
const assert = require('assert');

const sm = new SafeMap([[1, 2], [3, 4]]);
assert(sm);

for (const [k, v] of sm.entries()) {
  assert(k);
  assert(v);
}

class Foo {
  bar() {
    return 'bar';
  }
  baz() {
    return 'baz';
  }
}

const FooSafe = makeSafe(Foo, class SafeFoo extends Foo {
  constructor(i) { super(i); } // eslint-disable-line no-useless-constructor
});

const f = new FooSafe();
assert(f);
assert.deepStrictEqual(f.bar(), 'bar');
assert.deepStrictEqual(f.baz(), 'baz');

assert.throws(() => internalBinding('foo'));
