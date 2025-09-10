'use strict';

const primordials = require('./primordials');
const {
  BigInt,
  Error,
  NumberParseInt,
  ObjectEntries,
  ObjectGetOwnPropertyDescriptor,
  ObjectGetOwnPropertyDescriptors,
  ObjectGetOwnPropertySymbols,
  ObjectPrototypeToString,
  Symbol,
} = primordials;
const prxy = require('./proxy');
const ALL_PROPERTIES = 0;
const ONLY_ENUMERABLE = 2;
const kPending = Symbol('kPending');
const kRejected = Symbol('kRejected');

function getOwnNonIndexProperties(a, filter = ONLY_ENUMERABLE) {
  const desc = ObjectGetOwnPropertyDescriptors(a);
  const ret = [];
  // eslint-disable-next-line node-core/no-array-destructuring
  for (const [k, v] of ObjectEntries(desc)) {
    if (!/^(0|[1-9][0-9]*)$/.test(k) ||
        (NumberParseInt(k, 10) >= (2 ** 32 - 1))) { // Arrays are limited in size
      if ((filter === ONLY_ENUMERABLE) && !v.enumerable) {
        continue;
      }
      ret.push(k);
    }
  }
  for (const s of ObjectGetOwnPropertySymbols(a)) {
    const v = ObjectGetOwnPropertyDescriptor(a, s);
    if ((filter === ONLY_ENUMERABLE) && !v.enumerable) {
      continue;
    }
    ret.push(s);
  }
  return ret;
}

module.exports = {
  constants: {
    kPending,
    kRejected,
    ALL_PROPERTIES,
    ONLY_ENUMERABLE,
  },
  getOwnNonIndexProperties,
  getPromiseDetails() { return [kPending, undefined]; },
  getProxyDetails: prxy.getProxyDetails,
  Proxy: prxy.Proxy,
  previewEntries(val) {
    return [[], false];
  },
  getConstructorName(val) {
    if (!val || typeof val !== 'object') {
      // eslint-disable-next-line no-restricted-syntax
      throw new Error('Invalid object');
    }
    if (val.constructor?.name) {
      return val.constructor.name;
    }
    const str = ObjectPrototypeToString(val);
    // e.g. [object Boolean]
    const m = str.match(/^\[object ([^\]]+)\]/);
    if (m) {
      return m[1];
    }
    return 'Object';
  },
  getExternalValue() { return BigInt(0); },
};
