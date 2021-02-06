'use strict';

const prxy = require('./proxy');
const ALL_PROPERTIES = 0;
const ONLY_ENUMERABLE = 2;
const kPending = Symbol('kPending');
const kRejected = Symbol('kRejected');

function getOwnNonIndexProperties(a, filter = ONLY_ENUMERABLE) {
  const desc = Object.getOwnPropertyDescriptors(a);
  const ret = [];
  for (const [k, v] of Object.entries(desc)) {
    if (!/^(0|[1-9][0-9]*)$/.test(k) ||
        (parseInt(k, 10) >= (2 ** 32 - 1))) { // Arrays are limited in size
      if ((filter === ONLY_ENUMERABLE) && !v.enumerable) {
        continue;
      }
      ret.push(k);
    }
  }
  for (const s of Object.getOwnPropertySymbols(a)) {
    const v = Object.getOwnPropertyDescriptor(a, s);
    if ((filter === ONLY_ENUMERABLE) && !v.enumerable) {
      continue;
    }
    ret.push(s);
  }
  return ret;
}

module.exports = {
  getOwnNonIndexProperties,
  getPromiseDetails() { return [kPending, undefined]; },
  getProxyDetails: prxy.getProxyDetails,
  kPending,
  kRejected,
  previewEntries(val) {
    return [[], false];
  },
  getConstructorName(val) {
    if (!val || typeof val !== 'object') {
      throw new Error('Invalid object');
    }
    if (val.constructor && val.constructor.name) {
      return val.constructor.name;
    }
    const str = Object.prototype.toString.call(val);
    // e.g. [object Boolean]
    const m = str.match(/^\[object ([^\]]+)\]/);
    if (m) {
      return m[1];
    }
    return 'Object';
  },
  getExternalValue() { return BigInt(0); },
  propertyFilter: {
    ALL_PROPERTIES,
    ONLY_ENUMERABLE
  }
};
