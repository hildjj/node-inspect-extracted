'use strict';
const common = require('../common');
const assert = require('assert');
const path = require('../../src/path');

const failures = [];
// Fake one for the web case
const posixyCwd = '/';

const resolveTests = [
  [ path.resolve,
    // Arguments                    result
    [[['/var/lib', '../', 'file/'], '/var/file'],
     [['/var/lib', '/../', 'file/'], '/file'],
     [['/foo', '../..'], '/'],
     [['a/b', '../..'], '/'],
     [['abc'], '/abc'],
     [['/some/dir', '.', '/absolute/'], '/absolute'],
     [['/foo/tmp.3/', '../tmp.3/cycles/root.js'], '/foo/tmp.3/cycles/root.js'],
     [['a/b/c/', '../../..'], '/'],
     [['.'], '/'],
     [[], posixyCwd],
     [[''], posixyCwd],
     [['', ''], posixyCwd],
     [['.'], posixyCwd],
     [['/some/dir', '.', '/absolute/'], '/absolute'],
     [['/foo/tmp.3/', '../tmp.3/cycles/root.js'], '/foo/tmp.3/cycles/root.js'],
    ],
  ],
];
resolveTests.forEach(([resolve, tests]) => {
  tests.forEach(([test, expected]) => {
    const actual = resolve.apply(null, test);
    let actualAlt;
    const os = resolve === common.isWindows ? 'win32' : 'posix';

    const message =
      `path.${os}.resolve(${test.map(JSON.stringify).join(',')})\n  expect=${
        JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
    if (actual !== expected && actualAlt !== expected)
      failures.push(message);
  });
});
assert.strictEqual(failures.length, 0, failures.join('\n'));

assert.strictEqual(
  path.normalizeString('foo', false, '/', path.isPosixPathSeparator),
  'foo'
);

const dots = process.cwd().replace(/[^\\/]+/g, '..') + '/../../../foo';
assert.strictEqual(
  path.normalizeString(dots, true, '/', path.isPosixPathSeparator),
  dots.replace(/^[^/]*\//, ''),
);
