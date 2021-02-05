# node-inspect-extracted

This library provides an as-faithful-as-possible implementation of Node.js's
[`util.inspect`](https://nodejs.org/api/util.html#util_util_inspect_object_options) function.

It was built in such a way that it can be kept up-to-date with node's
[implementation](https://github.com/nodejs/node/blob/master/lib/internal/util/inspect.js),
by taking the code directly from node's repo, and changing nothing but the
`require()` statements.  All of the node built-in functions are emulated.
Many of the incompatibilities generated from that emulation are not
interesting for Web use cases.

## Installation

    npm install node-inspect-extracted

## Use

This should work in node (for testing) and browsers, using either `require`, `import`, or as `window.Inspect` if you include this in your page as a script tag.

With `require`:

```js
const { inspect } = require('node-inspect-extracted');
console.log(inspect(1));
```

With `import`:

```js
import * as inspect from 'node-inspect-extracted';
console.log(inspect.inspect(2));
```

From the browser:

```html
<script src="https://unpkg.com/node-inspect-extracted/dist/inspect.js"></script>
<script>
  console.log(Inspect.inspect(3));
</script>
```

## LICENSE

This code is an adaptation of the Node.js internal implementation, mostly from
the file lib/internal/util/inspect.js, which does not have the Joyent
copyright header.  The maintainers of this package will not assert copyright
over this code, but will assign ownership to the Node.js contributors, with
the same license as specified in the Node.js codebase; the portion adapted
here should all be plain MIT license.

[![Tests](https://github.com/hildjj/node-inspect-extracted/workflows/Tests/badge.svg)](https://github.com/hildjj/node-inspect-extracted/actions?query=workflow%3ATests)
[![Coverage Status](https://coveralls.io/repos/github/hildjj/node-inspect-extracted/badge.svg?branch=master)](https://coveralls.io/github/hildjj/node-inspect-extracted?branch=master)
