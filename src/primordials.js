'use strict';

// back-patch in primordials in user-land

const createSafeIterator = (factory, next) => {
  class SafeIterator {
    constructor(iterable) {
      this._iterator = factory(iterable);
    }
    next() {
      return next(this._iterator);
    }
    [Symbol.iterator]() {
      return this;
    }
  }
  Object.setPrototypeOf(SafeIterator.prototype, null);
  Object.freeze(SafeIterator.prototype);
  Object.freeze(SafeIterator);
  return SafeIterator;
};

function getGetter(cls, getter) {
  // TODO: __lookupGetter__ is deprecated, but Object.getOwnPropertyDescriptor
  // doesn't work on built-ins like Typed Arrays.
  return Function.prototype.call.bind(cls.prototype.__lookupGetter__(getter));
}

function getterCaller(getter) {
  return (val) => {
    return val.constructor.prototype.__lookupGetter__(getter).call(val);
  };
}

function uncurryThis(func) {
  return Function.prototype.call.bind(func);
}

const copyProps = (src, dest) => {
  Array.prototype.forEach.call(Reflect.ownKeys(src), (key) => {
    if (!Reflect.getOwnPropertyDescriptor(dest, key)) {
      Reflect.defineProperty(
        dest,
        key,
        Reflect.getOwnPropertyDescriptor(src, key));
    }
  });
};

const makeSafe = (unsafe, safe) => {
  if (Symbol.iterator in unsafe.prototype) {
    const dummy = new unsafe();
    let next; // We can reuse the same `next` method.

    Array.prototype.forEach.call(Reflect.ownKeys(unsafe.prototype), (key) => {
      if (!Reflect.getOwnPropertyDescriptor(safe.prototype, key)) {
        const desc = Reflect.getOwnPropertyDescriptor(unsafe.prototype, key);
        if (
          typeof desc.value === 'function' &&
          desc.value.length === 0 &&
          Symbol.iterator in (
            Function.prototype.call.call(desc.value, dummy) || {})) {
          const createIterator = uncurryThis(desc.value);
          if (next == null) {
            next = uncurryThis(createIterator(dummy).next);
          }
          const SafeIterator = createSafeIterator(createIterator, next);
          desc.value = function() {
            return new SafeIterator(this);
          };
        }
        Reflect.defineProperty(safe.prototype, key, desc);
      }
    });
  } else {
    copyProps(unsafe.prototype, safe.prototype);
  }
  copyProps(unsafe, safe);

  Object.setPrototypeOf(safe.prototype, null);
  Object.freeze(safe.prototype);
  Object.freeze(safe);
  return safe;
};

const StringIterator =
  Function.prototype.call.bind(String.prototype[Symbol.iterator]);
const StringIteratorPrototype = Reflect.getPrototypeOf(StringIterator(''));

function ErrorCaptureStackTrace(targetObject) {
  const stack = new Error().stack;
  // Remove the second line, which is this function
  targetObject.stack = stack.replace(/.*\n.*/, '$1');
}

module.exports = {
  makeSafe, // exported for testing
  internalBinding(mod) {
    if (mod === 'config') {
      return {
        hasIntl: false
      };
    }
    throw new Error(`unknown module: "${mod}"`);
  },
  Array,
  ArrayIsArray: Array.isArray,
  ArrayPrototypeFilter: Function.prototype.call.bind(Array.prototype.filter),
  ArrayPrototypeForEach: Function.prototype.call.bind(Array.prototype.forEach),
  ArrayPrototypeIncludes:
    Function.prototype.call.bind(Array.prototype.includes),
  ArrayPrototypeIndexOf: Function.prototype.call.bind(Array.prototype.indexOf),
  ArrayPrototypeJoin: Function.prototype.call.bind(Array.prototype.join),
  ArrayPrototypeMap: Function.prototype.call.bind(Array.prototype.map),
  ArrayPrototypePop: Function.prototype.call.bind(Array.prototype.pop),
  ArrayPrototypePush: Function.prototype.call.bind(Array.prototype.push),
  ArrayPrototypePushApply: Function.apply.bind(Array.prototype.push),
  ArrayPrototypeSlice: Function.prototype.call.bind(Array.prototype.slice),
  ArrayPrototypeSort: Function.prototype.call.bind(Array.prototype.sort),
  ArrayPrototypeSplice: Function.prototype.call.bind(Array.prototype.splice),
  ArrayPrototypeUnshift: Function.prototype.call.bind(Array.prototype.unshift),
  BigIntPrototypeValueOf:
    Function.prototype.call.bind(BigInt.prototype.valueOf),
  BooleanPrototypeValueOf:
    Function.prototype.call.bind(Boolean.prototype.valueOf),
  DatePrototypeGetTime: Function.prototype.call.bind(Date.prototype.getTime),
  DatePrototypeToISOString:
    Function.prototype.call.bind(Date.prototype.toISOString),
  DatePrototypeToString:
    Function.prototype.call.bind(Date.prototype.toString),
  ErrorCaptureStackTrace,
  ErrorPrototypeToString:
    Function.prototype.call.bind(Error.prototype.toString),
  FunctionPrototypeBind: Function.prototype.call.bind(Function.prototype.bind),
  FunctionPrototypeCall:
    Function.prototype.call.bind(Function.prototype.call),
  FunctionPrototypeToString:
    Function.prototype.call.bind(Function.prototype.toString),
  globalThis: (typeof globalThis === 'undefined') ? global : globalThis,
  JSONStringify: JSON.stringify,
  MapPrototypeGetSize: getGetter(Map, 'size'),
  MapPrototypeEntries: Function.prototype.call.bind(Map.prototype.entries),
  MathFloor: Math.floor,
  MathMax: Math.max,
  MathMin: Math.min,
  MathRound: Math.round,
  MathSqrt: Math.sqrt,
  MathTrunc: Math.trunc,
  Number,
  NumberIsFinite: Number.isFinite,
  NumberIsNaN: Number.isNaN,
  NumberParseFloat: Number.parseFloat,
  NumberParseInt: Number.parseInt,
  NumberPrototypeToString: Function.prototype.call.bind(Number.prototype.toString),
  NumberPrototypeValueOf:
    Function.prototype.call.bind(Number.prototype.valueOf),
  Object,
  ObjectAssign: Object.assign,
  ObjectCreate: Object.create,
  ObjectDefineProperty: Object.defineProperty,
  ObjectGetOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
  ObjectGetOwnPropertyNames: Object.getOwnPropertyNames,
  ObjectGetOwnPropertySymbols: Object.getOwnPropertySymbols,
  ObjectGetPrototypeOf: Object.getPrototypeOf,
  ObjectIs: Object.is,
  ObjectKeys: Object.keys,
  ObjectPrototypeHasOwnProperty:
    Function.prototype.call.bind(Object.prototype.hasOwnProperty),
  ObjectPrototypePropertyIsEnumerable:
    Function.prototype.call.bind(Object.prototype.propertyIsEnumerable),
  ObjectSeal: Object.seal,
  ObjectSetPrototypeOf: Object.setPrototypeOf,
  ReflectApply: Reflect.apply,
  ReflectOwnKeys: Reflect.ownKeys,
  RegExp,
  RegExpPrototypeExec: Function.prototype.call.bind(RegExp.prototype.exec),
  RegExpPrototypeSymbolReplace: Function.prototype.call.bind(RegExp.prototype[Symbol.replace]),
  RegExpPrototypeSymbolSplit: Function.prototype.call.bind(RegExp.prototype[Symbol.split]),
  RegExpPrototypeTest: Function.prototype.call.bind(RegExp.prototype.test),
  RegExpPrototypeToString:
    Function.prototype.call.bind(RegExp.prototype.toString),
  SafeStringIterator: createSafeIterator(
    StringIterator,
    Function.prototype.call.bind(StringIteratorPrototype.next)
  ),
  SafeMap: makeSafe(
    Map,
    class SafeMap extends Map {
      constructor(i) { super(i); } // eslint-disable-line no-useless-constructor
    }),
  SafeSet: makeSafe(
    Set,
    class SafeSet extends Set {
      constructor(i) { super(i); } // eslint-disable-line no-useless-constructor
    }),
  SetPrototypeGetSize: getGetter(Set, 'size'),
  SetPrototypeValues: Function.prototype.call.bind(Set.prototype.values),
  String,
  StringPrototypeCharCodeAt:
    Function.prototype.call.bind(String.prototype.charCodeAt),
  StringPrototypeCodePointAt:
    Function.prototype.call.bind(String.prototype.codePointAt),
  StringPrototypeEndsWith:
    Function.prototype.call.bind(String.prototype.endsWith),
  StringPrototypeIncludes:
    Function.prototype.call.bind(String.prototype.includes),
  StringPrototypeIndexOf:
    Function.prototype.call.bind(String.prototype.indexOf),
  StringPrototypeLastIndexOf:
    Function.prototype.call.bind(String.prototype.lastIndexOf),
  StringPrototypeNormalize:
    Function.prototype.call.bind(String.prototype.normalize),
  StringPrototypePadEnd:
    Function.prototype.call.bind(String.prototype.padEnd),
  StringPrototypePadStart:
    Function.prototype.call.bind(String.prototype.padStart),
  StringPrototypeRepeat: Function.prototype.call.bind(String.prototype.repeat),
  StringPrototypeReplace:
    Function.prototype.call.bind(String.prototype.replace),
  StringPrototypeReplaceAll:
    Function.prototype.call.bind(String.prototype.replaceAll),
  StringPrototypeSlice: Function.prototype.call.bind(String.prototype.slice),
  StringPrototypeSplit: Function.prototype.call.bind(String.prototype.split),
  StringPrototypeStartsWith: Function.prototype.call.bind(String.prototype.startsWith),
  StringPrototypeToLowerCase:
    Function.prototype.call.bind(String.prototype.toLowerCase),
  StringPrototypeTrim: Function.prototype.call.bind(String.prototype.trim),
  StringPrototypeValueOf:
    Function.prototype.call.bind(String.prototype.valueOf),
  SymbolPrototypeToString:
    Function.prototype.call.bind(Symbol.prototype.toString),
  SymbolPrototypeValueOf:
    Function.prototype.call.bind(Symbol.prototype.valueOf),
  SymbolIterator: Symbol.iterator,
  SymbolFor: Symbol.for,
  SymbolToStringTag: Symbol.toStringTag,
  TypedArrayPrototypeGetLength: getterCaller('length'),
  Uint8Array,
  uncurryThis
};

// Node 14
if (!String.prototype.replaceAll) {
  // Lifted and simplified from core-js for the moment.  Will remove when we
  // drop node 14 support.

  function requireObjectCoercible(it) {
    if (it == null) throw new TypeError("Can't call method on " + it);
    return it;
  }

  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = /\$([$&'`]|\d{1,2})/;
    if (namedCaptures !== undefined) {
      namedCaptures = Object(requireObjectCoercible(namedCaptures));
      symbols = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
    }
    return replacement.replace(symbols, (match, ch) => {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = Math.floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  };

  module.exports.StringPrototypeReplaceAll = (str, searchValue, replaceValue) => {
    var O = requireObjectCoercible(str);
    var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, replacement;
    var position = 0;
    var endOfLastMatch = 0;
    var result = '';
    if (searchValue != null) {
      IS_REG_EXP = searchValue instanceof RegExp;
      if (IS_REG_EXP) {
        flags = searchValue.flags;
        if (!~flags.indexOf('g')) {
          throw new TypeError('`.replaceAll` does not allow non-global regexes');
        }
      }
      replacer = searchValue[Symbol.replace];
      if (replacer) {
        return replacer.call(searchValue, O, replaceValue);
      }
    }
    string = String(O);
    searchString = String(searchValue);
    functionalReplace = (typeof replaceValue === 'function');
    if (!functionalReplace) replaceValue = String(replaceValue);
    searchLength = searchString.length;
    advanceBy = Math.max(1, searchLength);
    position = string.indexOf(searchString, 0);
    while (position !== -1) {
      replacement = functionalReplace ?
        String(replaceValue(searchString, position, string)) :
        getSubstitution(searchString, string, position, [], undefined, replaceValue);
      result += string.slice(endOfLastMatch, position) + replacement;
      endOfLastMatch = position + searchLength;
      position = string.indexOf(searchString, position + advanceBy);
    }
    if (endOfLastMatch < string.length) {
      result += string.slice(endOfLastMatch);
    }
    return result;
  };
}
