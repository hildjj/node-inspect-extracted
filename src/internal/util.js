'use strict';

const primordials = require('../primordials');
const {
  ArrayPrototypeJoin,
  Error,
  StringPrototypeReplace,
  SymbolFor,
} = primordials;

// eslint-disable-next-line no-control-regex
const colorRegExp = /\u001b\[\d\d?m/g;

module.exports = {
  customInspectSymbol: SymbolFor('nodejs.util.inspect.custom'),
  isError(e) {
    return e instanceof Error;
  },
  join: ArrayPrototypeJoin,
  removeColors(str) {
    return StringPrototypeReplace(str, colorRegExp, '');
  },
};
