'use strict';

const {
  inspect,
  format,
  formatWithOptions,
  stylizeWithHTML,
  Proxy
} = require('../dist/inspect');
const assert = require('assert');

assert(typeof inspect === 'function');
assert.strictEqual(inspect(null), 'null');
assert.strictEqual(inspect({a:1}, {compact: false}), '{\n  a: 1\n}');

assert.strictEqual(inspect({a:1}, {
  compact: false,
  stylize: stylizeWithHTML
}), '{\n  a: <span style="color:yellow;">1</span>\n}');

const p = new Proxy({a: false}, {});
assert.strictEqual(format('%%%o%%', p), '%Proxy [ { a: false }, {} ]%')
assert.strictEqual(formatWithOptions({
  compact: false
}, '%O', p), '{\n  a: false\n}')
