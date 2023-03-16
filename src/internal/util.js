'use strict';

// eslint-disable-next-line no-control-regex
const colorRegExp = /\u001b\[\d\d?m/g;

module.exports = {
  customInspectSymbol: Symbol.for('nodejs.util.inspect.custom'),
  isError(e) {
    return e instanceof Error;
  },
  join: Array.prototype.join.call.bind(Array.prototype.join),
  removeColors(str) {
    return String.prototype.replace.call(str, colorRegExp, '');
  },
};
