'use strict';

const primordials = require('../../primordials');
const {
  ArrayIsArray,
  BigInt,
  Boolean,
  DatePrototype,
  Error,
  FunctionPrototype,
  MapPrototypeHas,
  Number,
  ObjectDefineProperty,
  ObjectGetOwnPropertyDescriptor,
  ObjectGetPrototypeOf,
  ObjectIsFrozen,
  ObjectPrototype,
  SetPrototypeHas,
  String,
  Symbol,
  SymbolToStringTag,
  globalThis,
} = primordials;
const { getConstructorName } = require('../../util');

// From https://mathiasbynens.be/notes/globalthis
/* c8 ignore start */ // only needed for node 10
(function() {
  if (typeof globalThis === 'object') return;
  // eslint-disable-next-line node-core/avoid-prototype-pollution
  ObjectDefineProperty(ObjectPrototype, '__magic__', {
    get: function() {
      return this;
    },
    configurable: true,
  });
  // eslint-disable-next-line no-undef
  __magic__.globalThis = __magic__;
  delete ObjectPrototype.__magic__;
}());
/* c8 ignore stop */

function constructorNamed(val, ...name) {
  // Pass in names rather than types, in case SharedArrayBuffer (e.g.) isn't
  // in your browser
  for (const n of name) {
    const typ = globalThis[n];
    if (typ) {
      if (val instanceof typ) {
        return true;
      }
    }
  }
  // instanceOf doesn't work across vm boundaries, so check the whole
  // inheritance chain
  while (val) {
    if (typeof val !== 'object') {
      return false;
    }
    if (name.indexOf(getConstructorName(val)) >= 0) {
      return true;
    }
    val = ObjectGetPrototypeOf(val);
  }
  return false;
}

function checkBox(cls) {
  return (val) => {
    if (!constructorNamed(val, cls.name)) {
      return false;
    }
    try {
      cls.prototype.valueOf.call(val);
    } catch {
      return false;
    }
    return true;
  };
}

const isStringObject = checkBox(String);
const isNumberObject = checkBox(Number);
const isBooleanObject = checkBox(Boolean);
const isBigIntObject = checkBox(BigInt);
const isSymbolObject = checkBox(Symbol);

module.exports = {
  isAsyncFunction(val) {
    return (typeof val === 'function') &&
      FunctionPrototype.toString.call(val).startsWith('async');
  },
  isGeneratorFunction(val) {
    return (typeof val === 'function') &&
    FunctionPrototype.toString.call(val).match(/^(async\s+)?function *\*/);
  },
  isAnyArrayBuffer(val) {
    return constructorNamed(val, 'ArrayBuffer', 'SharedArrayBuffer');
  },
  isArrayBuffer(val) {
    return constructorNamed(val, 'ArrayBuffer');
  },
  isArgumentsObject(val) {
    const cond = (val !== null) &&
      (typeof val === 'object') &&
      !ArrayIsArray(val) &&
      (typeof val.length === 'number') &&
      (val.length === (val.length | 0)) &&
      (val.length >= 0);
    if (cond) {
      const prop = ObjectGetOwnPropertyDescriptor(val, 'callee');
      return prop && !prop.enumerable;
    }
    return false;
  },
  isBoxedPrimitive(val) {
    return isNumberObject(val) ||
      isStringObject(val) ||
      isBooleanObject(val) ||
      isBigIntObject(val) ||
      isSymbolObject(val);
  },
  isDataView(val) {
    return constructorNamed(val, 'DataView');
  },
  isExternal(val) {
    return (typeof val === 'object') &&
      (ObjectIsFrozen(val)) &&
      (ObjectGetPrototypeOf(val) == null);
  },
  isMap(val) {
    if (!constructorNamed(val, 'Map')) {
      return false;
    }
    try {
      MapPrototypeHas(val);
    } catch {
      return false;
    }
    return true;
  },
  isMapIterator(val) {
    return ObjectPrototype.toString.call(ObjectGetPrototypeOf(val)) ===
      '[object Map Iterator]';
  },
  isModuleNamespaceObject(val) {
    // TODO: this is weak and easily faked
    return val &&
      (typeof val === 'object') &&
      (val[SymbolToStringTag] === 'Module');
  },
  isNativeError(val) {
    return (val instanceof Error) && constructorNamed(
      val,
      'Error',
      'EvalError',
      'RangeError',
      'ReferenceError',
      'SyntaxError',
      'TypeError',
      'URIError',
      'AggregateError');
  },
  isPromise(val) {
    return constructorNamed(val, 'Promise');
  },
  isSet(val) {
    if (!constructorNamed(val, 'Set')) {
      return false;
    }
    try {
      SetPrototypeHas(val);
    } catch {
      return false;
    }
    return true;
  },
  isSetIterator(val) {
    return ObjectPrototype.toString.call(ObjectGetPrototypeOf(val)) ===
      '[object Set Iterator]';
  },
  isWeakMap(val) {
    return constructorNamed(val, 'WeakMap');
  },
  isWeakSet(val) {
    return constructorNamed(val, 'WeakSet');
  },
  isRegExp(val) {
    return constructorNamed(val, 'RegExp');
  },
  isDate(val) {
    if (constructorNamed(val, 'Date')) {
      try {
        DatePrototype.getTime.call(val); // Throws for pseudo-dates
        return true;
      } catch {
        // Ignored
      }
    }
    return false;
  },
  isTypedArray(val) {
    return constructorNamed(
      val,
      'Int8Array',
      'Uint8Array',
      'Uint8ClampedArray',
      'Int16Array',
      'Uint16Array',
      'Int32Array',
      'Uint32Array',
      'Float32Array',
      'Float64Array',
      'BigInt64Array',
      'BigUint64Array',
    );
  },
  isStringObject,
  isNumberObject,
  isBooleanObject,
  isBigIntObject,
  isSymbolObject,
};
