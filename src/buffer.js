'use strict';

const primordials = require('./primordials');
const {
  ArrayPrototypeMap,
} = primordials;

class Buffer {
  hexSlice(start = 0, end) {
    return ArrayPrototypeMap(
      this.slice(start, end),
      (x) => ('00' + x.toString(16)).slice(-2))
      .join('');
  }
}

exports.Buffer = Buffer;
