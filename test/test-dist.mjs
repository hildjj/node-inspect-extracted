import util from '../dist/inspect.js';
import assert from 'assert';

assert(typeof util.inspect === 'function');
assert.strictEqual(util.inspect(null), 'null');
assert.strictEqual(util.inspect({ a: 1 }, { compact: false }), '{\n  a: 1\n}');

assert.strictEqual(util.inspect({ a: 1 }, {
  compact: false,
  stylize: util.stylizeWithHTML
}), '{\n  a: <span style="color:yellow;">1</span>\n}');

const p = new util.Proxy({ a: false }, {});
assert.strictEqual(util.format('%%%o%%', p), '%Proxy [ { a: false }, {} ]%');
assert.strictEqual(util.formatWithOptions({
  compact: false
}, '%O', p), '{\n  a: false\n}');
