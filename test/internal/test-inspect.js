'use strict';

// Local tests.  Some of these should go back into node.js

const assert = require('assert');
const util = require('../../src/inspect.js');
const semver = require('semver');

// Errors thrown in accessors are re-thrown
{
  const obj = new Proxy({}, {
    get() {
      throw new Error('Error message');
    },
  });

  assert.throws(() => util.format(obj), { message: 'Error message' });
}

assert.strictEqual(
  util.getStringWidth(
    '\u3250\u4e00\ua960\uac00\uf900\ufe10\ufe30\uff01\uffe0\u{1b000}\u{1f200}\u{1f300}\u{20000}' +
    '\x7f\u0300\u200B\u20D0\uFE00\uFE20\u{E0100}',
    false,
  ),
  26,
);

assert.strictEqual(util.formatWithOptions({ numericSeparator: true }, '%d', 4000), '4_000');


assert.strictEqual(util.inspect({ a: 1 }, {
  compact: false,
  stylize: util.stylizeWithHTML,
}), '{\n  a: <span style="color:yellow;">1</span>\n}');

const a = {};
a.b = a;
assert.strictEqual(util.inspect(a, { compact: false }), '<ref *1> {\n  b: [Circular *1]\n}');
assert.strictEqual(util.inspect(a, { compact: true }), '<ref *1> { b: [Circular *1] }');

if (semver.satisfies(process.version, '>=16')) {
  const cause = new Error('cause');
  const e2 = new Error('wrapper', { cause });
  assert.match(util.inspect(e2), /\[cause\]: Error: cause\n/);
}
