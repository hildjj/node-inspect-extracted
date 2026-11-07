declare module "node:util" {
    export * as types from "node:util/types";
    export type InspectStyle =
        | "special"
        | "number"
        | "bigint"
        | "boolean"
        | "undefined"
        | "null"
        | "string"
        | "symbol"
        | "date"
        | "name"
        | "regexp"
        | "module";
    export interface InspectStyles extends Record<InspectStyle, InspectColor | ((value: string) => string)> {
        regexp: {
            (value: string): string;
            colors: InspectColor[];
        };
    }
    export type InspectColorModifier =
        | "reset"
        | "bold"
        | "dim"
        | "italic"
        | "underline"
        | "blink"
        | "inverse"
        | "hidden"
        | "strikethrough"
        | "doubleunderline";
    export type InspectColorForeground =
        | "black"
        | "red"
        | "green"
        | "yellow"
        | "blue"
        | "magenta"
        | "cyan"
        | "white"
        | "gray"
        | "redBright"
        | "greenBright"
        | "yellowBright"
        | "blueBright"
        | "magentaBright"
        | "cyanBright"
        | "whiteBright";
    export type InspectColorBackground = `bg${Capitalize<InspectColorForeground>}`;
    export type InspectColor = InspectColorModifier | InspectColorForeground | InspectColorBackground;
    export interface InspectColors extends Record<InspectColor, [number, number]> {}
    export interface InspectOptions {
        /**
         * If `true`, object's non-enumerable symbols and properties are included in the formatted result.
         * `WeakMap` and `WeakSet` entries are also included as well as user defined prototype properties (excluding method properties).
         * @default false
         */
        showHidden?: boolean | undefined;
        /**
         * Specifies the number of times to recurse while formatting object.
         * This is useful for inspecting large objects.
         * To recurse up to the maximum call stack size pass `Infinity` or `null`.
         * @default 2
         */
        depth?: number | null | undefined;
        /**
         * If `true`, the output is styled with ANSI color codes. Colors are customizable.
         */
        colors?: boolean | undefined;
        /**
         * If `false`, `[util.inspect.custom](depth, opts, inspect)` functions are not invoked.
         * @default true
         */
        customInspect?: boolean | undefined;
        /**
         * If `true`, `Proxy` inspection includes the target and handler objects.
         * @default false
         */
        showProxy?: boolean | undefined;
        /**
         * Specifies the maximum number of `Array`, `TypedArray`, `WeakMap`, and `WeakSet` elements
         * to include when formatting. Set to `null` or `Infinity` to show all elements.
         * Set to `0` or negative to show no elements.
         * @default 100
         */
        maxArrayLength?: number | null | undefined;
        /**
         * Specifies the maximum number of characters to
         * include when formatting. Set to `null` or `Infinity` to show all elements.
         * Set to `0` or negative to show no characters.
         * @default 10000
         */
        maxStringLength?: number | null | undefined;
        /**
         * The length at which input values are split across multiple lines.
         * Set to `Infinity` to format the input as a single line
         * (in combination with `compact` set to `true` or any number >= `1`).
         * @default 80
         */
        breakLength?: number | undefined;
        /**
         * Setting this to `false` causes each object key
         * to be displayed on a new line. It will also add new lines to text that is
         * longer than `breakLength`. If set to a number, the most `n` inner elements
         * are united on a single line as long as all properties fit into
         * `breakLength`. Short array elements are also grouped together. Note that no
         * text will be reduced below 16 characters, no matter the `breakLength` size.
         * For more information, see the example below.
         * @default true
         */
        compact?: boolean | number | undefined;
        /**
         * If set to `true` or a function, all properties of an object, and `Set` and `Map`
         * entries are sorted in the resulting string.
         * If set to `true` the default sort is used.
         * If set to a function, it is used as a compare function.
         */
        sorted?: boolean | ((a: string, b: string) => number) | undefined;
        /**
         * If set to `true`, getters are going to be
         * inspected as well. If set to `'get'` only getters without setter are going
         * to be inspected. If set to `'set'` only getters having a corresponding
         * setter are going to be inspected. This might cause side effects depending on
         * the getter function.
         * @default false
         */
        getters?: "get" | "set" | boolean | undefined;
        /**
         * If set to `true`, an underscore is used to separate every three digits in all bigints and numbers.
         * @default false
         */
        numericSeparator?: boolean | undefined;
    }
    export interface InspectContext extends Required<InspectOptions> {
        stylize(text: string, styleType: InspectStyle): string;
    }
    import _inspect = inspect;
    export interface Inspectable {
        [inspect.custom](depth: number, options: InspectContext, inspect: typeof _inspect): any;
    }
    export interface CallSiteObject {
        /**
         * Returns the name of the function associated with this call site.
         */
        functionName: string;
        /**
         * Returns the name of the resource that contains the script for the
         * function for this call site.
         */
        scriptName: string;
        /**
         * Returns the unique id of the script, as in Chrome DevTools protocol
         * [`Runtime.ScriptId`](https://chromedevtools.github.io/devtools-protocol/1-3/Runtime/#type-ScriptId).
         * @since v22.14.0
         */
        scriptId: string;
        /**
         * Returns the number, 1-based, of the line for the associate function call.
         */
        lineNumber: number;
        /**
         * Returns the 1-based column offset on the line for the associated function call.
         */
        columnNumber: number;
    }
    export type DiffEntry = [operation: -1 | 0 | 1, value: string];
    /**
     * `util.diff()` compares two string or array values and returns an array of difference entries.
     * It uses the Myers diff algorithm to compute minimal differences, which is the same algorithm
     * used internally by assertion error messages.
     *
     * If the values are equal, an empty array is returned.
     *
     * ```js
     * const { diff } = require('node:util');
     *
     * // Comparing strings
     * const actualString = '12345678';
     * const expectedString = '12!!5!7!';
     * console.log(diff(actualString, expectedString));
     * // [
     * //   [0, '1'],
     * //   [0, '2'],
     * //   [1, '3'],
     * //   [1, '4'],
     * //   [-1, '!'],
     * //   [-1, '!'],
     * //   [0, '5'],
     * //   [1, '6'],
     * //   [-1, '!'],
     * //   [0, '7'],
     * //   [1, '8'],
     * //   [-1, '!'],
     * // ]
     * // Comparing arrays
     * const actualArray = ['1', '2', '3'];
     * const expectedArray = ['1', '3', '4'];
     * console.log(diff(actualArray, expectedArray));
     * // [
     * //   [0, '1'],
     * //   [1, '2'],
     * //   [0, '3'],
     * //   [-1, '4'],
     * // ]
     * // Equal values return empty array
     * console.log(diff('same', 'same'));
     * // []
     * ```
     * @since v22.15.0
     * @experimental
     * @param actual The first value to compare
     * @param expected The second value to compare
     * @returns An array of difference entries. Each entry is an array with two elements:
     * * Index 0: `number` Operation code: `-1` for delete, `0` for no-op/unchanged, `1` for insert
     * * Index 1: `string` The value associated with the operation
     */
    export function diff(actual: string | readonly string[], expected: string | readonly string[]): DiffEntry[];
    /**
     * The `util.format()` method returns a formatted string using the first argument
     * as a `printf`-like format string which can contain zero or more format
     * specifiers. Each specifier is replaced with the converted value from the
     * corresponding argument. Supported specifiers are:
     *
     * If a specifier does not have a corresponding argument, it is not replaced:
     *
     * ```js
     * util.format('%s:%s', 'foo');
     * // Returns: 'foo:%s'
     * ```
     *
     * Values that are not part of the format string are formatted using `util.inspect()` if their type is not `string`.
     *
     * If there are more arguments passed to the `util.format()` method than the
     * number of specifiers, the extra arguments are concatenated to the returned
     * string, separated by spaces:
     *
     * ```js
     * util.format('%s:%s', 'foo', 'bar', 'baz');
     * // Returns: 'foo:bar baz'
     * ```
     *
     * If the first argument does not contain a valid format specifier, `util.format()` returns a string that is the concatenation of all arguments separated by spaces:
     *
     * ```js
     * util.format(1, 2, 3);
     * // Returns: '1 2 3'
     * ```
     *
     * If only one argument is passed to `util.format()`, it is returned as it is
     * without any formatting:
     *
     * ```js
     * util.format('%% %s');
     * // Returns: '%% %s'
     * ```
     *
     * `util.format()` is a synchronous method that is intended as a debugging tool.
     * Some input values can have a significant performance overhead that can block the
     * event loop. Use this function with care and never in a hot code path.
     * @since v0.5.3
     * @param format A `printf`-like format string.
     */
    export function format(format?: any, ...param: any[]): string;
    /**
     * This function is identical to {@link format}, except in that it takes
     * an `inspectOptions` argument which specifies options that are passed along to {@link inspect}.
     *
     * ```js
     * util.formatWithOptions({ colors: true }, 'See object %O', { foo: 42 });
     * // Returns 'See object { foo: 42 }', where `42` is colored as a number
     * // when printed to a terminal.
     * ```
     * @since v10.0.0
     */
    export function formatWithOptions(inspectOptions: InspectOptions, format?: any, ...param: any[]): string;
    /**
     * The `util.inspect()` method returns a string representation of `object` that is
     * intended for debugging. The output of `util.inspect` may change at any time
     * and should not be depended upon programmatically. Additional `options` may be
     * passed that alter the result.
     * `util.inspect()` will use the constructor's name and/or `Symbol.toStringTag`
     * property to make an identifiable tag for an inspected value.
     *
     * ```js
     * class Foo {
     *   get [Symbol.toStringTag]() {
     *     return 'bar';
     *   }
     * }
     *
     * class Bar {}
     *
     * const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });
     *
     * util.inspect(new Foo()); // 'Foo [bar] {}'
     * util.inspect(new Bar()); // 'Bar {}'
     * util.inspect(baz);       // '[foo] {}'
     * ```
     *
     * Circular references point to their anchor by using a reference index:
     *
     * ```js
     * import { inspect } from 'node:util';
     *
     * const obj = {};
     * obj.a = [obj];
     * obj.b = {};
     * obj.b.inner = obj.b;
     * obj.b.obj = obj;
     *
     * console.log(inspect(obj));
     * // <ref *1> {
     * //   a: [ [Circular *1] ],
     * //   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
     * // }
     * ```
     *
     * The following example inspects all properties of the `util` object:
     *
     * ```js
     * import util from 'node:util';
     *
     * console.log(util.inspect(util, { showHidden: true, depth: null }));
     * ```
     *
     * The following example highlights the effect of the `compact` option:
     *
     * ```js
     * import { inspect } from 'node:util';
     *
     * const o = {
     *   a: [1, 2, [[
     *     'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
     *       'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
     *     'test',
     *     'foo']], 4],
     *   b: new Map([['za', 1], ['zb', 'test']]),
     * };
     * console.log(inspect(o, { compact: true, depth: 5, breakLength: 80 }));
     *
     * // { a:
     * //   [ 1,
     * //     2,
     * //     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
     * //           'test',
     * //           'foo' ] ],
     * //     4 ],
     * //   b: Map(2) { 'za' => 1, 'zb' => 'test' } }
     *
     * // Setting `compact` to false or an integer creates more reader friendly output.
     * console.log(inspect(o, { compact: false, depth: 5, breakLength: 80 }));
     *
     * // {
     * //   a: [
     * //     1,
     * //     2,
     * //     [
     * //       [
     * //         'Lorem ipsum dolor sit amet,\n' +
     * //           'consectetur adipiscing elit, sed do eiusmod \n' +
     * //           'tempor incididunt ut labore et dolore magna aliqua.',
     * //         'test',
     * //         'foo'
     * //       ]
     * //     ],
     * //     4
     * //   ],
     * //   b: Map(2) {
     * //     'za' => 1,
     * //     'zb' => 'test'
     * //   }
     * // }
     *
     * // Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
     * // single line.
     * ```
     *
     * The `showHidden` option allows `WeakMap` and `WeakSet` entries to be
     * inspected. If there are more entries than `maxArrayLength`, there is no
     * guarantee which entries are displayed. That means retrieving the same
     * `WeakSet` entries twice may result in different output. Furthermore, entries
     * with no remaining strong references may be garbage collected at any time.
     *
     * ```js
     * import { inspect } from 'node:util';
     *
     * const obj = { a: 1 };
     * const obj2 = { b: 2 };
     * const weakSet = new WeakSet([obj, obj2]);
     *
     * console.log(inspect(weakSet, { showHidden: true }));
     * // WeakSet { { a: 1 }, { b: 2 } }
     * ```
     *
     * The `sorted` option ensures that an object's property insertion order does not
     * impact the result of `util.inspect()`.
     *
     * ```js
     * import { inspect } from 'node:util';
     * import assert from 'node:assert';
     *
     * const o1 = {
     *   b: [2, 3, 1],
     *   a: '`a` comes before `b`',
     *   c: new Set([2, 3, 1]),
     * };
     * console.log(inspect(o1, { sorted: true }));
     * // { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
     * console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
     * // { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }
     *
     * const o2 = {
     *   c: new Set([2, 1, 3]),
     *   a: '`a` comes before `b`',
     *   b: [2, 3, 1],
     * };
     * assert.strict.equal(
     *   inspect(o1, { sorted: true }),
     *   inspect(o2, { sorted: true }),
     * );
     * ```
     *
     * The `numericSeparator` option adds an underscore every three digits to all
     * numbers.
     *
     * ```js
     * import { inspect } from 'node:util';
     *
     * const thousand = 1000;
     * const million = 1000000;
     * const bigNumber = 123456789n;
     * const bigDecimal = 1234.12345;
     *
     * console.log(inspect(thousand, { numericSeparator: true }));
     * // 1_000
     * console.log(inspect(million, { numericSeparator: true }));
     * // 1_000_000
     * console.log(inspect(bigNumber, { numericSeparator: true }));
     * // 123_456_789n
     * console.log(inspect(bigDecimal, { numericSeparator: true }));
     * // 1_234.123_45
     * ```
     *
     * `util.inspect()` is a synchronous method intended for debugging. Its maximum
     * output length is approximately 128 MiB. Inputs that result in longer output will
     * be truncated.
     * @since v0.3.0
     * @param object Any JavaScript primitive or `Object`.
     * @return The representation of `object`.
     */
    export function inspect(object: any, showHidden?: boolean, depth?: number | null, color?: boolean): string;
    export function inspect(object: any, options?: InspectOptions): string;
    export namespace inspect {
        const custom: unique symbol;
        let colors: InspectColors;
        let styles: InspectStyles;
        let defaultOptions: InspectOptions;
        let replDefaults: InspectOptions;
    }
   /**
     * Returns `str` with any ANSI escape codes removed.
     *
     * ```js
     * console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
     * // Prints "value"
     * ```
     * @since v16.11.0
     */
    export function stripVTControlCharacters(str: string): string;
}
declare module "util" {
    export * from "node:util";
}
