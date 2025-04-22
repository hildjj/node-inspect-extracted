'use strict';

// Local tests.  Some of these should go back into node.js

require('../common');
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


assert.strictEqual(util.inspect({
  'a': 1,
  'b': '<p>\xa0\u{1F4A9}</p>',
  '&lt;': NaN,
  [Symbol('<br>')]: false,
  'buf': new Uint8Array([1, 2, 3, 4]),
}, {
  compact: false,
  stylize: util.stylizeWithHTML,
}), '{\n' +
  '  a: <span style="color:yellow;">1</span>,\n' +
  '  b: <span style="color:green;">&apos;&lt;p&gt;&nbsp;\u{1F4A9}&lt;&#47;p&gt;&apos;</span>,\n' +
  '  <span style="color:green;">&apos;&amp;lt&#59;&apos;</span>: <span style="color:yellow;">NaN</span>,\n' +
  '  buf: Uint8Array(4) [\n' +
  '    <span style="color:yellow;">1</span>,\n' +
  '    <span style="color:yellow;">2</span>,\n' +
  '    <span style="color:yellow;">3</span>,\n' +
  '    <span style="color:yellow;">4</span>\n' +
  '  ],\n' +
  '  <span style="color:green;">Symbol&#40;&lt;br&gt;&#41;</span>: <span style="color:yellow;">false</span>\n' +
  '}');

const a = {};
a.b = a;
assert.strictEqual(util.inspect(a, { compact: false }), '<ref *1> {\n  b: [Circular *1]\n}');
assert.strictEqual(util.inspect(a, { compact: true }), '<ref *1> { b: [Circular *1] }');

if (semver.satisfies(process.version, '>=16')) {
  const cause = new Error('cause');
  const e2 = new Error('wrapper', { cause });
  assert.match(util.inspect(e2), /\[cause\]: Error: cause\n/);
}

const u = new URL('http://user:pass@localhost:8080/?foo=bar#baz');
assert.strictEqual(
  util.inspect(u, { }),
  'http://user:pass@localhost:8080/?foo=bar#baz');

assert.strictEqual(
  util.inspect({ u }, { customInspect: false, depth: 0 }),
  '{ u: URL {} }');
