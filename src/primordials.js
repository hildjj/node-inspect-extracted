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
  return Function.call.bind(cls.prototype.__lookupGetter__(getter));
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
            Function.prototype.call.call(desc.value, dummy) ?? {})) {
          const createIterator = uncurryThis(desc.value);
          next ??= uncurryThis(createIterator(dummy).next);
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

const StringIterator = String.prototype[Symbol.iterator].call
  .bind(String.prototype[Symbol.iterator]);
const StringIteratorPrototype = Reflect.getPrototypeOf(StringIterator(''));

function ErrorCaptureStackTrace(targetObject) {
  const stack = new Error().stack;
  // Remove the second line, which is this function
  targetObject.stack = stack.replace(/.*\n.*/, '$1');
}

module.exports = {
  Array,
  ArrayIsArray: Array.isArray,
  ArrayPrototypeFilter:
    Array.prototype.filter.call.bind(Array.prototype.filter),
  ArrayPrototypeForEach:
    Array.prototype.forEach.call.bind(Array.prototype.forEach),
  ArrayPrototypeIncludes:
    Array.prototype.includes.call.bind(Array.prototype.includes),
  ArrayPrototypePush:
    Array.prototype.push.call.bind(Array.prototype.push),
  ArrayPrototypePushApply:
    Array.prototype.push.apply.bind(Array.prototype.push),
  ArrayPrototypeSort: Array.prototype.sort.call.bind(Array.prototype.sort),
  ArrayPrototypeUnshift:
    Array.prototype.unshift.call.bind(Array.prototype.unshift),
  BigIntPrototypeValueOf:
    BigInt.prototype.valueOf.call.bind(BigInt.prototype.valueOf),
  BooleanPrototypeValueOf:
    Boolean.prototype.valueOf.call.bind(Boolean.prototype.valueOf),
  DatePrototypeGetTime:
    Date.prototype.getTime.call.bind(Date.prototype.getTime),
  DatePrototypeToISOString:
    Date.prototype.toISOString.call.bind(Date.prototype.toISOString),
  DatePrototypeToString:
    Date.prototype.toString.call.bind(Date.prototype.toString),
  ErrorCaptureStackTrace,
  ErrorPrototypeToString:
    Error.prototype.toString.call.bind(Error.prototype.toString),
  FunctionPrototypeCall:
    Function.prototype.call.call.bind(Function.prototype.call),
  FunctionPrototypeToString:
    Function.prototype.toString.call.bind(Function.prototype.toString),
  JSONStringify: JSON.stringify,
  MapPrototypeGetSize: getGetter(Map, 'size'),
  MapPrototypeEntries: Map.prototype.entries.call.bind(Map.prototype.entries),
  MathFloor: Math.floor,
  MathMax: Math.max,
  MathMin: Math.min,
  MathRound: Math.round,
  MathSqrt: Math.sqrt,
  Number,
  NumberIsNaN: Number.isNaN,
  NumberParseFloat: Number.parseFloat,
  NumberParseInt: Number.parseInt,
  NumberPrototypeValueOf:
    Number.prototype.valueOf.call.bind(Number.prototype.valueOf),
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
    Object.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty),
  ObjectPrototypePropertyIsEnumerable:
    Object.prototype.propertyIsEnumerable.call.bind(
      Object.prototype.propertyIsEnumerable),
  ObjectSeal: Object.seal,
  ObjectSetPrototypeOf: Object.setPrototypeOf,
  ReflectApply: Reflect.apply,
  ReflectOwnKeys: Reflect.ownKeys,
  RegExp,
  RegExpPrototypeTest: RegExp.prototype.test.call.bind(RegExp.prototype.test),
  RegExpPrototypeToString:
    RegExp.prototype.toString.call.bind(RegExp.prototype.toString),
  SafeStringIterator: createSafeIterator(
    StringIterator,
    StringIteratorPrototype.next.call.bind(StringIteratorPrototype.next)
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
  SafeWeakMap: makeSafe(
    WeakMap,
    class SafeWeakMap extends WeakMap {
      constructor(i) { super(i); } // eslint-disable-line no-useless-constructor
    }),
  SetPrototypeGetSize: getGetter(Set, 'size'),
  SetPrototypeValues: Set.prototype.values.call.bind(Set.prototype.values),
  String,
  StringPrototypeCharCodeAt:
    String.prototype.charCodeAt.call.bind(String.prototype.charCodeAt),
  StringPrototypeCodePointAt:
    String.prototype.codePointAt.call.bind(String.prototype.codePointAt),
  StringPrototypeEndsWith:
    String.prototype.endsWith.call.bind(String.prototype.endsWith),
  StringPrototypeIncludes:
    String.prototype.includes.call.bind(String.prototype.includes),
  StringPrototypeNormalize:
    String.prototype.normalize.call.bind(String.prototype.normalize),
  StringPrototypePadEnd:
    String.prototype.padEnd.call.bind(String.prototype.padEnd),
  StringPrototypePadStart:
    String.prototype.padStart.call.bind(String.prototype.padStart),
  StringPrototypeRepeat:
    String.prototype.repeat.call.bind(String.prototype.repeat),
  StringPrototypeReplace:
    String.prototype.replace.call.bind(String.prototype.replace),
  StringPrototypeSlice:
    String.prototype.slice.call.bind(String.prototype.slice),
  StringPrototypeSplit:
    String.prototype.split.call.bind(String.prototype.split),
  StringPrototypeToLowerCase:
    String.prototype.toLowerCase.call.bind(String.prototype.toLowerCase),
  StringPrototypeTrim: String.prototype.trim.call.bind(String.prototype.trim),
  StringPrototypeValueOf:
    String.prototype.valueOf.call.bind(String.prototype.valueOf),
  SymbolPrototypeToString:
    Symbol.prototype.toString.call.bind(Symbol.prototype.toString),
  SymbolPrototypeValueOf:
    Symbol.prototype.valueOf.call.bind(Symbol.prototype.valueOf),
  SymbolIterator: Symbol.iterator,
  SymbolFor: Symbol.for,
  SymbolToStringTag: Symbol.toStringTag,
  TypedArrayPrototypeGetLength: getterCaller('length'),
  TypedArrayPrototypeGetSymbolToStringTag(val) {
    return val[Symbol.toStringTag];
  },
  Uint8Array,
  uncurryThis
};
