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

## Colors

If you specify `{colors: true}` in the inspect options, you will get ANSI
escape codes, just as you would in Node.  That's unlikely to be helpful to you
on the Web, so you might want `stylizeWithHTML`, which is also exported from the package:

```js
inspect({a:1}, {
  compact: false,
  stylize: stylizeWithHTML
}
```

which yields this ugly HTML:
```html
{
  a: <span style="color:yellow;">1</span>
}
```

If you want better HTML, the [lightly-documented](https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects) `stylize` option requires
a function that takes two parameters, a string, and a class name.  The mappings
from class names to colors is in `inspect.styles`, so start with this:

```js
stylizeWithHTML(str, styleType) {
  const style = inspect.styles[styleType];
  if (style !== undefined) {
    return `<span style="color:${style};">${str}</span>`;
  }
  return str;
}
```

## Known Limiations

 - If you want your
   [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
   objects to have their internal object inspected, you may use the `Proxy`
   constructor exported by this project.  That was done mostly for test coverage
   purposes, it is not recommended for production code.
 - [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
   objects are not treated specially.
   [[bug](https://github.com/hildjj/node-inspect-extracted/issues/1)]
 - Several of the existing type checks (corresponding to Node's
   [`util.types`](https://nodejs.org/api/util.html#util_util_types)) are
   weaker than the ones in Node, which has the freedom to use internal
   capabilities of the runtime.  This means you can fake out the type
   detection to get output different than node.
   [[bug](https://github.com/hildjj/node-inspect-extracted/issues/2)]
 - Objects that have been mangled with `Object.setPrototypeOf`
   do not retain their original type information.
   [[bug](https://github.com/hildjj/node-inspect-extracted/issues/3)]
 - `Promise` state is not visible.  All Promises will show up as
   `Promise< pending >` no matter what state they are in.
 - `Map` and `Set` iterators will not show their internal state because that
   cannot be done from unprivileged code without modifying the iterator.
   Entry iterators are not distinguished from value iterators.
   [[bug](https://github.com/hildjj/node-inspect-extracted/issues/4)]
 - `WeakMap` and `WeakSet` will not show their contents, because those contents
   cannot be iterated over in unprivileged code.
 - Colorful stack traces are not completely accurate with respect to what
   modules are Node-internal.  This doesn't matter on the Web.

## LICENSE

This code is an adaptation of the Node.js internal implementation, mostly from
the file lib/internal/util/inspect.js, which does not have the Joyent
copyright header.  The maintainers of this package will not assert copyright
over this code, but will assign ownership to the Node.js contributors, with
the same license as specified in the Node.js codebase; the portion adapted
here should all be plain MIT license.

[![Tests](https://github.com/hildjj/node-inspect-extracted/workflows/Tests/badge.svg)](https://github.com/hildjj/node-inspect-extracted/actions?query=workflow%3ATests)
[![Coverage Status](https://coveralls.io/repos/github/hildjj/node-inspect-extracted/badge.svg?branch=master)](https://coveralls.io/github/hildjj/node-inspect-extracted?branch=master)
